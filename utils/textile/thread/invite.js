import { ThreadID, Query } from '@textile/hub';

import Utils from '../../index';
import Ceramic from '../../ceramic';
import invites from '../../../config/invites.json';
import chatSchema from '../../../config/schema/chat.json';

class Invite {
  constructor(client, address) {
    this._client = client;
    this._address = address;
    this._collection = process.env.TEXTILE_COLLECTION_INVITE;
    this._threadID = ThreadID.fromString(invites.threadID);
  }

  async delete(ids) {
    await this._client.delete(this._threadID, this._collection, ids);
  }

  async findBy({ from, to }) {
    console.debug(`Retrieving chat request from: ${from}, and to: ${to}`);

    const results = await this._find(Query.where('from').eq(from).and('to').eq(to));
    if (results?.length === 0) {
      return null;
    }

    return await this._decrypt(results.pop());
  }

  async get() {
    console.debug('Retrieving all received/(approved sent) chat requests');

    // received/sent chat requests (rejected filtered out).
    const [received, sent] = await Promise.all([
      this._getRequests('to', this._address),
      this._getRequests('from', this._address),
    ]);

    return { received, sent };
  }

  async post(to) {
    // Verify whether a request has been sent before.
    const query = Query.where('to').eq(to).and('from').eq(this._address);
    const results = await this._find(query);
    if (results?.length > 0) {
      throw new Error('Have already sent a chat request to this address before');
    }

    // Create a new thread for chat.
    const payload = await this._newThread();
    const encrypted = await this._encrypt(payload, to);

    console.debug('Sending chat request to: ', to);
    await this._client.create(this._threadID, this._collection, [{ to, from: this._address, date: new Date().toISOString(), dbInfo: encrypted }]);
  }

  //
  //////////////////////////////////////////////////////////////////////////////
  // PRIVATE METHODS.
  //////////////////////////////////////////////////////////////////////////////
  //

  async _newThread() {
    const thread = await this._client.newDB();
    const dbInfo = await this._client.getDBInfo(thread);
    await this._client.newCollection(thread, { name: process.env.TEXTILE_COLLECTION_CHAT, schema: chatSchema });

    return {
      threadID: thread.toString(),
      dbInfo,
    };
  }

  async _find(query) {
    return await this._client.find(this._threadID, this._collection, query);
  }

  _getValue(key, value) {
    return key === 'to' ? value.from : value.to;
  }

  _filter(results, key) {
    results = results.reduce((p, result) => ({ ...p, [this._getValue(key, result)]: result }), {});
    return Object.keys(results).map(from => results[from]);
  }

  async _getRequests(key, value) {
    let results = await this._find(Query.where(key).eq(value));
    results = this._filter(results, key);

    // retrieve rejected requests.
    const query = Query.where(key).eq(value).and('accepted').eq(false);
    const rejected = await this._client.find(this._threadID, process.env.TEXTILE_COLLECTION_INVITE_ACK, query);
    const rejectedAddresses = rejected.map(reject => this._getValue(key, reject));

    results = results.filter(result => !rejectedAddresses.includes(this._getValue(key, result)));

    return await Promise.all(results.map(this._decrypt));
  }

  async _decrypt(result) {
    const ceramic = await Utils.getInstance(Ceramic);

    try {
      result.dbInfo = await ceramic.decrypt(result.dbInfo);
    } catch (err) {}

    return result;
  }

  async _encrypt(payload, to) {
    const ceramic = await Utils.getInstance(Ceramic);
    return await ceramic.encrypt(payload, to);
  }
}

export default Invite;
