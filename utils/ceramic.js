import { EthereumAuthProvider, SelfID } from '@self.id/web';

export const getSelfProfile = async () => {
  const [address] = await window.ethereum.enable();

  const self = await SelfID.authenticate({
    authProvider: new EthereumAuthProvider(window.ethereum, address),
    ceramic: process.env.CERAMIC_NODE_URL,
    connectNetwork: process.env.CERAMIC_NETWORK,
  });

  return await self.get('basicProfile');
}

export const updateProfile = async (profile) => {
  const [address] = await window.ethereum.enable();

  const self = await SelfID.authenticate({
    authProvider: new EthereumAuthProvider(window.ethereum, address),
    ceramic: process.env.CERAMIC_NODE_URL,
    connectNetwork: process.env.CERAMIC_NETWORK,
  });

  return await self.set('basicProfile', profile);
}

export const getProfile = async (did) => {

}
