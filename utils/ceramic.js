import LRU from 'lru-cache';
import { WebClient, EthereumAuthProvider, SelfID } from '@self.id/web';
import { Caip10Link } from '@ceramicnetwork/stream-caip10-link';
import CeramicClient from '@ceramicnetwork/http-client';

const profileCache = new LRU({
  max: 50,
  maxAge: 60 * 60 * 1000,
});

/**
 * {@link https://developers.ceramic.network/tools/self-id/overview/}
 **/

export const getSelfProfile = async () => {
  const [address] = await window.ethereum.enable();

  const self = await SelfID.authenticate({
    authProvider: new EthereumAuthProvider(window.ethereum, address),
    ceramic: process.env.CERAMIC_NODE_URL,
    connectNetwork: process.env.CERAMIC_NETWORK,
  });

  console.debug('Retrieving authenticated ceramic basicProfile');

  return await self.get('basicProfile');
}

export const updateProfile = async (profile) => {
  const [address] = await window.ethereum.enable();

  const self = await SelfID.authenticate({
    authProvider: new EthereumAuthProvider(window.ethereum, address),
    ceramic: process.env.CERAMIC_NODE_URL,
    connectNetwork: process.env.CERAMIC_NETWORK,
  });

  console.debug('Updating ceramic basicProfile');

  return await self.set('basicProfile', profile);
}

export const getProfile = async (address) => {
  console.debug('Searching ceramic profile for: ', address);

  if (profileCache.has(address)) {
    console.debug('Found profile in cache. Not downloading from ceramic');
    return profileCache.get(address);
  }

  const ceramic = new CeramicClient(process.env.CERAMIC_NODE_URL);
  const { did } = await Caip10Link.fromAccount(ceramic, `${address.toLowerCase()}@eip155:4`);
  if (!did) {
    return null;
  }

  const self = new WebClient({
    ceramic: process.env.CERAMIC_NODE_URL,
    connectNetwork: process.env.CERAMIC_NETWORK,
  });

  console.debug('Retrieving un-authenticated ceramic basicProfile');

  const profile = await self.get('basicProfile', did);
  profileCache.set(address, profile);

  return profileCache.get(address);
}
