import { Client, ThreadID, Query } from '@textile/hub';

import Textile from './base';
import Utils from '../index';
import Ceramic from '../ceramic';
import invites from '../../config/invites.json';

class Thread extends Textile {
  constructor() {
    super(Client);
  }

  static getInstance() {
    return (async () => await new Thread().build())();
  }

  static getClassName() {
    return 'Thread';
  }

  async join(callback, info = null) {
    try {
      await this.client.joinFromInfo(info?.dbInfo || invites.dbInfo);
    } catch (err) {
      // fails if tries to join again. Hence ignoring.
    }

    this.listen(callback, info?.threadID);
  }

  listen(callback, threadId = null) {
    const filters = [{ actionTypes: ['CREATE'] }];
    const threadID = ThreadID.fromString(threadId || invites.threadID);
    this.client.listen(threadID, filters, callback);
  }

  invite() {
    const client = this.client;
    const collection = process.env.TEXTILE_COLLECTION_INVITE;
    const threadID = ThreadID.fromString(invites.threadID);

    async function newThread() {
      const thread = await client.newDB();
      const dbInfo = await client.getDBInfo(thread);

      return {
        threadID: thread.toString(),
        dbInfo,
      };
    }

    async function find(query) {
      return await client.find(threadID, collection, query);
    }

    async function getRequests(key, value) {
      const results = await find(Query.where(key).eq(value));

      const getValue = (key, value) => key === 'to' ? value.from : value.to;

      // retrieve rejected requests.
      const query = Query.where(key).eq(value).and('accepted').eq(false);
      const rejected = await client.find(threadID, process.env.TEXTILE_COLLECTION_INVITE_ACK, query);
      const rejectedAddresses = rejected.map(reject => getValue(key, reject));

      return results.filter(result => !rejectedAddresses.includes(getValue(key, result)));
    }

    return function(client) {
      return {
        get: async function() {
          console.debug('Retrieving all received chat requests');

          // received chat requests (rejected filtered out).
          const [to] = await window.ethereum.enable();
          const results = await getRequests('to', to);

          // perform decryption.
          if (results?.length > 0) {
            const ceramic = await Utils.getInstance(Ceramic);
            const map = {};

            for (const result of results) {
              try {
                result.dbInfo = await ceramic.decrypt(result.dbInfo);
                map[result.from] = result;
              } catch (err) {}
            }

            return Object.keys(map).map(from => map[from]);
          }

          return results;
        },

        post: async function(to) {
          const [from] = await window.ethereum.enable();

          // Verify whether a request has been sent before.
          const query = Query.where('to').eq(to).and('from').eq(from);
          const results = await find(query);
          if (results?.length > 0) {
            throw new Error('Have already sent a chat request to this address before');
          }

          // Create a new thread for chat.
          const payload = await newThread();

          // Encrypt the joinInfo.
          const ceramic = await Utils.getInstance(Ceramic);
          const encrypted = await ceramic.encrypt(payload, to);

          console.debug('Sending chat request to: ', to);
          await client.create(threadID, collection, [{ to, from, date: new Date().toISOString(), dbInfo: encrypted }]);
        },
      };
    }(this.client);
  }

  ack() {
    const collection = process.env.TEXTILE_COLLECTION_INVITE_ACK;
    const threadID = ThreadID.fromString(invites.threadID);

    return function(client) {
      return {
        get: async function(from) {
          const [to] = await window.ethereum.enable();

          const query = Query.where('to').eq(to).and('from').eq(from);
          const results = await client.find(threadID, collection, query);

          return results?.length > 0 ? results[0] : null;
        },

        post: async function(accepted, from) {
          const [to] = await window.ethereum.enable();

          console.debug('Sending chat ack to: ', to);
          await client.create(threadID, collection, [{ to, from, date: new Date().toISOString(), accepted }]);
        }
      }
    }(this.client);
  }
};

export default Thread;
