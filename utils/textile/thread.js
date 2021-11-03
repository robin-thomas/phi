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

  async sendRequest(to) {
    const [from] = await window.ethereum.enable();
    const threadID = ThreadID.fromString(invites.threadID);

    // Verify whether a request has been sent before.
    const query = Query.where('to').eq(to).and('from').eq(from);
    const results = await this.client.find(threadID, process.env.TEXTILE_INVITE_COLLECTION, query);
    if (results?.length > 0) {
      throw new Error('Have already sent a chat request to this address before');
    }

    // Create a new thread for chat.
    const thread = await this.client.newDB();
    const dbInfo = await this.client.getDBInfo(thread);
    const payload = {
      threadID: thread.toString(),
      dbInfo,
    };

    // Encrypt the joinInfo.
    const ceramic = await Utils.getInstance(Ceramic);
    const encrypted = await ceramic.encrypt(payload, to);

    console.debug('Sending chat request to: ', to);
    await this.client.create(threadID, 'invite', [{ to, from, date: new Date().toISOString(), dbInfo: encrypted }]);
  }

  async getRequests() {
    console.debug('Retrieving all received chat requests');

    const [to] = await window.ethereum.enable();
    const query = Query.where('to').eq(to);

    const threadID = ThreadID.fromString(invites.threadID);
    const results = await this.client.find(threadID, process.env.TEXTILE_INVITE_COLLECTION, query);

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
  }
};

export default Thread;
