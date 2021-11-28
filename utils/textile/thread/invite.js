import LRU from 'lru-cache';
import { ThreadID, Query } from '@textile/hub';

import Utils from '../../index';
import Ceramic from '../../ceramic';
import invites from '../../../config/invites.json';
import chatSchema from '../../../config/schema/chat.json';
import loanSchema from '../../../config/schema/loan.json';

class Invite {
  constructor(client) {
    this._client = client;
    this._collection = process.env.TEXTILE_COLLECTION_INVITE;
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
    console.debug('Retrieving all chat requests from textile');

    // Retrieve all sent/received invites..
    const results = await this._client.find(this._threadID, this._collection, new Query());
    const invites = results.filter(result => result.from === this._address || result.to === this._address);

    // Store it in cache.
    for (const invite of invites) {
      const key = invite.from + invite.to;
      const value = await this._decrypt(invite);
      this._cache.set(key, value);
    }
  }

  async get(from, to) {
    console.debug(`Retrieving chat request from: ${from}, and to: ${to}`);
    return this._cache.has(from + to) ? this._cache.get(from + to) : null;
  }

  async getAll() {
    console.debug('Retrieving all received/(approved sent) chat requests from cache');

    // if cache is empty, load all.
    if (this._cache.keys().length === 0) {
      await this.load();
    }

    const sent = [], received = [];
    for (const key of this._cache.keys()) {
      if (key.startsWith(this._address)) {
        sent.push(this._cache.get(key));
      }

      if (key.endsWith(this._address)) {
        received.push(this._cache.get(key));
      }
    }

    return { received, sent };
  }

  async post(to) {
    const key = this._address + to;

    // Verify whether a request has been sent before.
    if (this._cache.has(key)) {
      throw new Error('Have already sent a chat request to this address before');
    }

    // Create a new thread for chat.
    const payload = await this._newThread();
    const encrypted = await this._encrypt(payload, to);

    console.debug('Sending chat request to: ', to);
    const params = { to, from: this._address, date: new Date().toISOString(), dbInfo: encrypted };
    await this._client.create(this._threadID, this._collection, [params]);
  }

  async callback(reply, err) {
    if (!err && reply?.collectionName === this._collection) {
      if ([reply?.instance?.from, reply?.instance.to].includes(this._address)) {
        const result = await this._decrypt(reply.instance);
        this._cache.set(result.from + result.to, result);

        const sent = this._address === result.from;
        return { sent, address: sent ? result.to : result.from };
      }
    }
  }

  //
  //////////////////////////////////////////////////////////////////////////////
  // PRIVATE METHODS.
  //////////////////////////////////////////////////////////////////////////////
  //

  async _newThread() {
    const thread = await this._client.newDB();
    const dbInfo = await this._client.getDBInfo(thread);

    // Create chat and loan collection in the new thread.
    await this._client.newCollection(thread, { name: process.env.TEXTILE_COLLECTION_CHAT, schema: chatSchema });
    await this._client.newCollection(thread, { name: process.env.TEXTILE_COLLECTION_LOAN, schema: loanSchema });

    return {
      threadID: thread.toString(),
      dbInfo,
    };
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
