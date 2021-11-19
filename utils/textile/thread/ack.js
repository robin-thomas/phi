import LRU from 'lru-cache';
import { ThreadID, Query } from '@textile/hub';

import invites from '../../../config/invites.json';

class Ack {
  constructor(client, address) {
    this._client = client;
    this._address = address;
    this._collection = process.env.TEXTILE_COLLECTION_INVITE_ACK;
    this._threadID = ThreadID.fromString(invites.threadID);

    this._cache = new LRU({
      max: 50,
      maxAge: 60 * 60 * 1000,
    });
  }

  async load() {
    // Retrieve all acks.
    const results = await this._client.find(this._threadID, this._collection, new Query());

    // Store it in cache.
    for (const result of results) {
      const key = result.from + result.to;
      this._cache.set(key, result);
    }
  }

  async get(from, to = null) {
    to = to || this._address;

    const key = from + to;
    if (this._cache.has(key)) {
      return this._cache.get(key);
    }

    return null;
  }

  async post(accepted, from) {
    console.debug('Sending chat ack to: ', this._address);

    const params = { to: this._address, from, date: new Date().toISOString(), accepted };
    await this._client.create(this._threadID, this._collection, [params]);
    this._cache.set(from + this._address, params);
  }
}

export default Ack;
