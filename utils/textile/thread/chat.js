import { ThreadID, Query } from '@textile/hub';

import Utils from '../../index';
import Ceramic from '../../ceramic';

class Chat {
  constructor(client, address) {
    this._client = client;
    this._address = address;
    this._collection = process.env.TEXTILE_COLLECTION_CHAT;
    this._threadID = null;
  }

  setThreadId(threadID) {
    this._threadID = ThreadID.fromString(threadID);
  }

  async delete(ids) {
    await this._client.delete(this._threadID, this._collection, ids);
  }

  async getAll() {
    const chats = await this._client.find(this._threadID, this._collection, new Query());
    return await Promise.all(chats.map(this._decrypt));
  }

  async post(to, message, attachments = []) {
    const encrypted = await this._encrypt(message, to);

    const params = { from: this._address, to, message: encrypted, attachments };
    await this._client.create(this._threadID, this._collection, [{...params, date: new Date().toISOString() }]);
  }

  //
  //////////////////////////////////////////////////////////////////////////////
  // PRIVATE METHODS
  //////////////////////////////////////////////////////////////////////////////
  //

  async _decrypt(chat) {
    const ceramic = await Utils.getInstance(Ceramic);

    try {
      chat.message = await ceramic.decrypt(chat.message);
    } catch (err) {}

    return chat;
  }

  async _encrypt(payload, to) {
    const ceramic = await Utils.getInstance(Ceramic);
    return await ceramic.encrypt(payload, to);
  }
}

export default Chat;
