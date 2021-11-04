import LRU from 'lru-cache';
import { WebClient, EthereumAuthProvider, SelfID } from '@self.id/web';
import { Caip10Link } from '@ceramicnetwork/stream-caip10-link';
import CeramicClient from '@ceramicnetwork/http-client';

const address2did = async (address) => {
  const ceramic = new CeramicClient(process.env.CERAMIC_NODE_URL);
  const { did } = await Caip10Link.fromAccount(ceramic, `${address.toLowerCase()}@eip155:4`);
  return did;
}

class Ceramic {
  static getInstance() {
    return (async () => await new Ceramic().build())();
  }

  static getClassName() {
    return 'Ceramic';
  }

  async build() {
    this.cache = new LRU({
      max: 50,
      maxAge: 60 * 60 * 1000,
    });

    this.address = (await window.ethereum.enable())[0];

    this.self = await SelfID.authenticate({
      authProvider: new EthereumAuthProvider(window.ethereum, this.address),
      ceramic: process.env.CERAMIC_NODE_URL,
      connectNetwork: process.env.CERAMIC_NETWORK,
    });

    this.client = new WebClient({
      ceramic: process.env.CERAMIC_NODE_URL,
      connectNetwork: process.env.CERAMIC_NETWORK,
    });

    this.did = this.self.client.ceramic.did;

    return this;
  }

  async updateProfile(profile) {
    console.debug('Updating ceramic basicProfile to: ', profile);
    return await this.self.set('basicProfile', profile);
  }

  async getProfile(address = null) {
    if (!address) {
      console.debug('Retrieving authenticated ceramic basicProfile');
      return await this.self.get('basicProfile');
    }

    console.debug('Searching ceramic profile for: ', address);

    if (this.cache.has(address)) {
      console.debug('Found profile in cache. Not downloading from ceramic');
      return this.cache.get(address);
    }

    const did = await address2did(address);
    if (!did) {
      return null;
    }

    console.debug('Retrieving un-authenticated ceramic basicProfile');
    const profile = await this.client.get('basicProfile', did);
    this.cache.set(address, profile);

    return this.cache.get(address);
  }

  searchProfiles(keyword) {
    const results = [];
    keyword = keyword.toLowerCase();

    // exact match to an address.
    const addresses = this.cache.keys();
    if (addresses.includes(keyword)) {
      return keyword;
    }

    // search for names.
    for (const address of this.cache.keys()) {
      const profile = this.cache.get(address);
      const name = profile?.name?.toLowerCase() || '';

      if (name.startsWith(keyword)) {
        results.push(address);
      }
    }

    return results;
  }

  async encrypt(payload, address) {
    const did = await address2did(address);
    const encrypted = await this.did.createDagJWE(payload, [did]);
    return Buffer.from(JSON.stringify(encrypted)).toString('hex');
  }

  async decrypt(payload) {
    const jwe = Buffer.from(payload, 'hex').toString();
    return await this.did.decryptDagJWE(JSON.parse(jwe));
  }
}

export default Ceramic;
