import LRU from 'lru-cache';
import { ThreadID, Query } from '@textile/hub';

import invites from '../../../config/invites.json';

class Ack {
  constructor(client) {
    this._client = client;
    this._collection = process.env.TEXTILE_COLLECTION_INVITE_ACK;
    this._threadID = ThreadID.fromString(invites.threadID);

    this._cache = new LRU({
      max: 50,
      maxAge: 60 * 60 * 1000,
    });
  }

  setAddress(address) {
    this._address = address;
  }

  async load() {
    console.debug('Retrieving all chat acks from textile');

    // Retrieve all acks.
    const results = await this._client.find(this._threadID, this._collection, new Query());
    const acks = results.filter(result => result.from === this._address || result.to === this._address);

    // Store it in cache.
    for (const result of acks) {
      const key = result.from + result.to;
      this._cache.set(key, result);
    }
  }

  async get(from, to = null) {
    const key = from + (to || this._address);
    return this._cache.has(key) ? this._cache.get(key) : null;
  }

  async post(accepted, from) {
    console.debug('Sending chat ack to: ', this._address);

    const params = { to: this._address, from, date: new Date().toISOString(), accepted };
    await this._client.create(this._threadID, this._collection, [params]);
  }

  async callback(reply, err) {
    if (reply?.collectionName === this._collection) {
      if (!err && [reply?.instance?.from, reply?.instance.to].includes(this._address)) {
        console.debug('Received a chat ack from: ', reply.instance.from);
        this._cache.set(reply.instance.from + reply.instance.to, reply.instance);
      }

      return { ack: true };
    }
  }
}

export default Ack;
