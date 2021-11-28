import LRU from 'lru-cache';
import { ThreadID, Query } from '@textile/hub';

import Utils from '../../index';
import Ceramic from '../../ceramic';

class Chat {
  constructor(client) {
    this._client = client;
    this._collection = process.env.TEXTILE_COLLECTION_CHAT;
    this._threadID = null;

    this._cache = new LRU({
      max: 500,
      maxAge: 60 * 60 * 1000,
    });
  }

  setThreadId(threadID) {
    this._threadID = ThreadID.fromString(threadID);
  }

  setAddress(address) {
    this._address = address;
  }

  async getAll() {
    const threadID = this._threadID.toString();

    if (this._cache.has(threadID)) {
      console.debug('Retrieving all chats from cache');
      return this._cache.get(threadID);
    }

    console.debug('Retrieving all chat requests from textile, and decrypting it');
    const chats = await this._client.find(this._threadID, this._collection, new Query());
    const results = await Promise.all(chats.map(this._decrypt));

    this._cache.set(threadID, results);
    return results;
  }

  async post(to, message, attachments = []) {
    console.debug('Sending chat message to: ', to);

    const encrypted = await this._encrypt(message, to);
    const params = { from: this._address, to, message: encrypted, attachments, date: new Date().toISOString() };
    await this._client.create(this._threadID, this._collection, [params]);
  }

  async listen(reply, err) {
    if (!err && reply?.collectionName === this._collection) {
      if ([reply?.instance?.from, reply?.instance.to].includes(this._address)) {
        console.debug('Received a chat message from: ', reply?.instance?.from);

        const result = await this._decrypt(reply.instance);
        this._cache.set(result.from + result.to, result);
        return result;
      }
    }
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
