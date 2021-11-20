import LRU from 'lru-cache';
import { ThreadID, Query } from '@textile/hub';

class Loan {
  constructor(client, address) {
    this._client = client;
    this._address = address;
    this._collection = process.env.TEXTILE_COLLECTION_LOAN;
    this._threadID = null;

    this._cache = new LRU({
      max: 50,
      maxAge: 60 * 60 * 1000,
    });
  }

  setThreadId(threadID) {
    this._threadID = ThreadID.fromString(threadID);
  }

  async getAll() {
    const threadID = this._threadID.toString();

    if (this._cache.has(threadID)) {
      return this._cache.get(threadID);
    }

    const loans = await this._client.find(this._threadID, this._collection, new Query());
    this._cache.set(threadID, loans);
    return loans;
  }

  async post({ to, amount, months }) {
    const params = { from: this._address, to, amount, months, currency: "USD", date: new Date().toISOString() };
    await this._client.create(this._threadID, this._collection, [params]);
  }

  async listen(reply, err) {
    if (!err && reply?.collectionName === this._collection) {
      if ([reply?.instance?.from, reply?.instance.to].includes(this._address)) {
        const result = await this._decrypt(reply.instance);
        this._cache.set(result.from + result.to, result);
        return result;
      }
    }
  }
}

export default Loan;
