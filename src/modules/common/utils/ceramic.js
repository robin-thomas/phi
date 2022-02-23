import CeramicClient from '@ceramicnetwork/http-client';
import { Caip10Link } from '@ceramicnetwork/stream-caip10-link';
import { Eip1193Bridge } from '@ethersproject/experimental';
import { WebClient, EthereumAuthProvider, SelfID } from '@self.id/web';


import { CERAMIC_NETWORK, CERAMIC_NODE_URL } from '../constants/ceramic';

let webClient = null;
let authenticatedClient = null;

export const address2did = async (address) => {
  const ceramic = new CeramicClient(CERAMIC_NODE_URL);
  const { did } = await Caip10Link.fromAccount(ceramic, `${address.toLowerCase()}@eip155:4`);
  if (!did) {
    const result = await Caip10Link.fromAccount(ceramic, `${address.toLowerCase()}@eip155:80001`);
    return result.did;
  }
  return did;
}

export const self = async (address, provider) => {
  if (!authenticatedClient) {
    const _provider = new Eip1193Bridge(provider.getSigner(), provider);

    authenticatedClient = await SelfID.authenticate({
      authProvider: new EthereumAuthProvider(_provider, address),
      ceramic: CERAMIC_NODE_URL,
      connectNetwork: CERAMIC_NETWORK,
    });
  }

  return authenticatedClient;
}

export const client = () => {
  if (!webClient) {
    webClient = new WebClient({
      ceramic: CERAMIC_NODE_URL,
      connectNetwork: CERAMIC_NETWORK,
    });
  }

  return webClient;
}

export const encryptJSON = async (payload, sender, receiver) => {
  const receiverDid = await address2did(receiver);

  const { client } = await self(sender);
  const did = client.ceramic.did;

  const encrypted = await did.createDagJWE(payload, [receiverDid, did.id]); // end-to-end encryption.
  return Buffer.from(JSON.stringify(encrypted)).toString('hex');
}

export const decryptJSON = async (hex, receiver) => {
  const jwe = Buffer.from(hex, 'hex').toString();

  const { client } = await self(receiver);
  const did = client.ceramic.did;

  return await did.decryptDagJWE(JSON.parse(jwe));
}
