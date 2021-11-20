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

    this.address = (await window.ethereum.enable())[0].toLowerCase();

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

  setDefaults(profile) {
    profile = profile || {};
    profile.name = profile?.name || 'John Doe';
    profile.description = profile?.description || 'Available';
    return profile;
  }

  async getProfile(address = null) {
    if (!address) {
      console.debug('Retrieving authenticated ceramic basicProfile');
      const profile = await this.self.get('basicProfile');
      return this.setDefaults(profile);
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

    this.cache.set(address, this.setDefaults(profile));
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
    const encrypted = await this.did.createDagJWE(payload, [did, this.did.id]);
    return Buffer.from(JSON.stringify(encrypted)).toString('hex');
  }

  async decrypt(payload) {
    const jwe = Buffer.from(payload, 'hex').toString();
    return await this.did.decryptDagJWE(JSON.parse(jwe));
  }

  file() {
    return function(did) {
      return {
        encrypt: async function(ab, address) {
          const _did = await address2did(address);
          const jwe = await did.createJWE(new Uint8Array(ab), [_did, did.id]);
          return Buffer.from(JSON.stringify(jwe)).toString('hex');
        },

        decrypt: async function(hex) {
          const jwe = Buffer.from(hex, 'hex').toString();
          return await did.decryptJWE(JSON.parse(jwe));
        },
      }
    }(this.did);
  }
}

export default Ceramic;
