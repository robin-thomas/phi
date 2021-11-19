import { ThreadID, Query } from '@textile/hub';

import invites from '../../../config/invites.json';

class Ack {
  constructor(client, address) {
    this._client = client;
    this._address = address;
    this._collection = process.env.TEXTILE_COLLECTION_INVITE_ACK;
    this._threadID = ThreadID.fromString(invites.threadID);
  }

  async delete(id) {
    await this._client.delete(this._threadID, this._collection, [id]);
  }

  async get(from, to = null) {
    to = to || this._address;

    const query = Query.where('to').eq(to).and('from').eq(from);
    const results = await this._client.find(this._threadID, this._collection, query);

    return results?.length > 0 ? results[0] : null;
  }

  async post(accepted, from) {
    console.debug('Sending chat ack to: ', this._address);
    await this._client.create(this._threadID, this._collection, [{ to: this._address, from, date: new Date().toISOString(), accepted }]);
  }
}

export default Ack;
