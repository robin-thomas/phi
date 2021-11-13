import { Client, ThreadID, Query } from '@textile/hub';

import Textile from './base';
import Utils from '../index';
import Ceramic from '../ceramic';
import invites from '../../config/invites.json';
import chatSchema from '../../config/schema/chat.json';

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
    this.client.joinFromInfo(info?.dbInfo || invites.dbInfo)
      .then(() => this.listen(callback, info?.threadID))
      .catch();
  }

  listen(callback, threadId = null) {
    const filters = [{ actionTypes: ['CREATE'] }];
    const threadID = ThreadID.fromString(threadId || invites.threadID);
    this.client.listen(threadID, filters, callback);
  }

  chat(threadID) {
    const collection = process.env.TEXTILE_COLLECTION_CHAT;
    threadID = ThreadID.fromString(threadID);

    return function(client) {
      return {
        delete: async function(ids) {
          await client.delete(threadID, collection, ids);
        },

        getAll: async function() {
          const chats = await client.find(threadID, collection, new Query());

          if (chats?.length > 0) {
            const ceramic = await Utils.getInstance(Ceramic);

            for (const chat of chats) {
              chat.message = await ceramic.decrypt(chat.message);
            }
          }

          return chats;
        },

        post: async function(to, message, attachments = []) {
          // Encrypt the message.
          const ceramic = await Utils.getInstance(Ceramic);
          const encrypted = await ceramic.encrypt(message, to);

          const [from] = await window.ethereum.enable();
          const params = { from, to, message: encrypted, attachments };
          await client.create(threadID, collection, [{...params, date: new Date().toISOString() }]);
        },
      }
    }(this.client);
  }

  invite() {
    const client = this.client;
    const collection = process.env.TEXTILE_COLLECTION_INVITE;
    const threadID = ThreadID.fromString(invites.threadID);

    async function newThread() {
      const thread = await client.newDB();
      const dbInfo = await client.getDBInfo(thread);
      await client.newCollection(thread, { name: process.env.TEXTILE_COLLECTION_CHAT, schema: chatSchema });

      return {
        threadID: thread.toString(),
        dbInfo,
      };
    }

    async function find(query) {
      return await client.find(threadID, collection, query);
    }

    const getValue = (key, value) => key === 'to' ? value.from : value.to;

    const filter = (results, key) => {
      results = results.reduce((p, result) => ({ ...p, [getValue(key, result)]: result }), {});
      return Object.keys(results).map(from => results[from]);
    }

    async function getRequests(key, value) {
      let results = await find(Query.where(key).eq(value));
      results = filter(results, key);

      // retrieve rejected requests.
      const query = Query.where(key).eq(value).and('accepted').eq(false);
      const rejected = await client.find(threadID, process.env.TEXTILE_COLLECTION_INVITE_ACK, query);
      const rejectedAddresses = rejected.map(reject => getValue(key, reject));

      return results.filter(result => !rejectedAddresses.includes(getValue(key, result)));
    }

    async function decrypt(result) {
      const ceramic = await Utils.getInstance(Ceramic);

      try {
        result.dbInfo = await ceramic.decrypt(result.dbInfo);
      } catch (err) {}

      return result;
    }

    return function(client) {
      return {
        delete: async function(ids) {
          await client.delete(threadID, collection, ids);
        },

        findBy: async function({ from, to }) {
          console.debug(`Retrieving chat request from: ${from}, and to: ${to}`);

          const results = await find(Query.where('from').eq(from).and('to').eq(to));
          if (results?.length === 0) {
            return null;
          }

          return await decrypt(results.pop());
        },

        get: async function() {
          console.debug('Retrieving all received/(approved sent) chat requests');

          // received chat requests (rejected filtered out).
          const [me] = await window.ethereum.enable();
          let received = await getRequests('to', me);

          // perform decryption.
          if (received?.length > 0) {
            const ceramic = await Utils.getInstance(Ceramic);

            for (const result of received) {
              try {
                result.dbInfo = await ceramic.decrypt(result.dbInfo);
              } catch (err) {}
            }
          }

          const sent = await getRequests('from', me);
          return { received, sent };
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
        delete: async function(id) {
          await client.delete(threadID, collection, [id]);
        },

        get: async function(from, to = null) {
          if (!to) {
            to = (await window.ethereum.enable())[0];
          }

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
