import { Client, ThreadID, Query } from '@textile/hub';
import LRUCache from 'lru-cache';

import invites from '@/config/invites.json';
import { getClient } from '@/modules/common/utils/textile';

class Base {
  constructor(cacheConfig, collection) {
    this._client = null;
    this._collection = collection;
    this._cache = new LRUCache(cacheConfig);

    this._threadID = ThreadID.fromString(invites.threadID);
  }

  async loadClient(address) {
    if (!this._client) {
      this._client = await getClient(Client, 'Client');
      this._address = address;
    }
  }

  address() {
    return this._address;
  }

  cache() {
    return this._cache;
  }

  client() {
    return this._client;
  }

  threadID() {
    return this._threadID;
  }

  async loadMessages(address, mapper = async (e) => e) {
    await this.loadClient(address);

    // Retrieve all messages.
    const results = await this._client.find(this._threadID, this._collection, new Query());
    const filtered = results.filter(result => [result.from, result.to].includes(address));

    // Store it in cache.
    for (const result of filtered) {
      const key = result.from + result.to;
      const value = await mapper(result);
      this._cache.set(key, value);
    }
  }

  get(from, to) {
    return this._cache.has(from + to) ? this._cache.get(from + to) : null;
  }

  async post(params) {
    await this._client.create(this._threadID, this._collection, [params]);
  }

  sent() {
    const sent = [];
    for (const key of this._cache.keys()) {
      if (key.startsWith(this._address)) {
        sent.push(this._cache.get(key));
      }
    }

    return sent;
  }

  received() {
    const received = [];
    for (const key of this._cache.keys()) {
      if (key.endsWith(this._address)) {
        received.push(this._cache.get(key));
      }
    }

    return received;
  }

  async callback(reply, err, mapper = async (e) => e) {
    if (reply?.collectionName === this._collection) {
      const result = { collection: true };

      if (!err && [reply?.instance?.from, reply?.instance.to].includes(this._address)) {
        result.instance = await mapper(reply.instance);
        this._cache.set(reply.instance.from + reply.instance.to, result);
      }

      return result;
    }
  }
}

export default Base;
