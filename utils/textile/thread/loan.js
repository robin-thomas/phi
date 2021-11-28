import LRU from 'lru-cache';
import { ThreadID, Query } from '@textile/hub';

class Loan {
  constructor(client) {
    this._client = client;
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

  setAddress(address) {
    this._address = address;
  }

  async getAll() {
    const threadID = this._threadID.toString();

    if (this._cache.has(threadID)) {
      const values = this._cache.get(threadID);
      return Object.keys(values).reduce((p, c) => [...p, values[c]], []);
    }

    const loans = await this._client.find(this._threadID, this._collection, new Query());
    const values = loans.reduce((p, c) => ({ ...p, [c._id]: c }), {});
    this._cache.set(threadID, values);
    return loans;
  }

  async post({ to, amount, months }) {
    console.debug(`Sending loan request to ${to}, for $${amount} and ${months} months`);

    const params = { from: this._address, to, amount, months, currency: "USD", created: new Date().toISOString() };
    return await this._client.create(this._threadID, this._collection, [params]);
  }

  listen(_callback, filter) {
    const _this = this;

    function callback(reply, err) {
      const response = _this._handler(filter).bind(_this)(reply, err);
      _callback(response);
    }

    const filters = [{ actionTypes: [filter] }];
    return this._client.listen(this._threadID, filters, callback);
  }

  async delete(id) {
    await this._client.delete(this._threadID, this._collection, [id]);
  }

  //
  //////////////////////////////////////////////////////////////////////////////
  // PRIVATE METHODS
  //////////////////////////////////////////////////////////////////////////////
  //

  _handler(filter) {
    switch(filter) {
      case 'CREATE':
        return this._createHandler;

      case 'UPDATE':
        return this._updateHandler;

      case 'DELETE':
        return this._deleteHandler;
    }
  }

  _createHandler(reply, err) {
    if (!err && reply?.collectionName === this._collection && reply?.action === 'CREATE') {
      if ([reply?.instance?.from, reply?.instance.to].includes(this._address)) {
        const threadID = this._threadID.toString();

        const loans = this._cache.has(threadID) ? this._cache.get(threadID) : [];
        this._cache.set(threadID, ({...loans, [reply.instance._id]: reply.instance }));

        return reply.instance;
      }
    }
  }

  _deleteHandler(reply, err) {
    if (!err && reply?.collectionName === this._collection) {
      const threadID = this._threadID.toString();

      const loans = this._cache.has(threadID) ? this._cache.get(threadID) : [];
      delete loans[reply.instanceID];
      this._cache.set(threadID, loans);

      return reply.instanceID;
    }
  }

  _updateHandler(reply, err) {
    if (!err && reply?.collectionName === this._collection && reply?.action === 'SAVE') {
      return reply.instanceID;
    }
  }
}

export default Loan;
