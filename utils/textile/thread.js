import { Client, PrivateKey, ThreadID } from '@textile/hub';

import Textile from './base';
import Ack from './thread/ack';
import Chat from './thread/chat';
import Invite from './thread/invite';
import invites from '../../config/invites.json';

class Thread extends Textile {
  constructor() {
    super(Client, Thread);
  }

  static getInstance() {
    return (async () => {
      const obj = await new Thread().build();

      obj._ack = new Ack(obj.client);
      obj._chat = new Chat(obj.client);
      obj._invite = new Invite(obj.client);

      return obj;
    })();
  }

  static getClassName() {
    return 'Thread';
  }

  listen(callback, threadId = null) {
    const filters = [{ actionTypes: ['CREATE'] }];
    const threadID = ThreadID.fromString(threadId || invites.threadID);
    this.client.listen(threadID, filters, callback);
  }

  // get the thread info to be sent over chat invite.
  async getDBInfo(threadID) {
    const dbInfo = await this.client.getDBInfo(ThreadID.fromString(threadID));

    const result = {
      threadID,
      dbInfo
    };

    return Buffer.from(JSON.stringify(result)).toString('hex');
  }

  chat(threadID, address) {
    this._chat.setAddress(address);
    this._chat.setThreadId(threadID);
    return this._chat;
  }

  invite(address) {
    this._invite.setAddress(address);
    return this._invite;
  }

  ack(address) {
    this._ack.setAddress(address);
    return this._ack;
  }
};

export default Thread;

// TextileClient for the server.
const TextileClient = {
  client: null,

  getClient: async () => {
    if (!TextileClient.client) {
      TextileClient.client = await Client.withKeyInfo({ key: process.env.TEXTILE_KEY, secret: '' });
      const identity = await PrivateKey.fromRandom();
      await TextileClient.client.getToken(identity);
    }

    return TextileClient.client;
  }
}


export const getTextileClient = TextileClient.getClient;
