import CeramicClient from '@ceramicnetwork/http-client';
import { Caip10Link } from '@ceramicnetwork/stream-caip10-link';
import { WebClient, EthereumAuthProvider, SelfID } from '@self.id/web';

import { getAddress } from './address';

let webClient = null;
let authenticatedClient = null;

export const address2did = async (address) => {
  const ceramic = new CeramicClient(process.env.CERAMIC_NODE_URL);
  const { did } = await Caip10Link.fromAccount(ceramic, `${address.toLowerCase()}@eip155:4`);
  if (!did) {
    const result = await Caip10Link.fromAccount(ceramic, `${address.toLowerCase()}@eip155:80001`);
    return result.did;
  }
  return did;
}

export const self = async () => {
  if (!authenticatedClient) {
    const address = await getAddress();

    authenticatedClient = await SelfID.authenticate({
      authProvider: new EthereumAuthProvider(window.ethereum, address),
      ceramic: process.env.CERAMIC_NODE_URL,
      connectNetwork: process.env.CERAMIC_NETWORK,
    });
  }

  return authenticatedClient;
}

export const client = () => {
  if (!webClient) {
    webClient = new WebClient({
      ceramic: process.env.CERAMIC_NODE_URL,
      connectNetwork: process.env.CERAMIC_NETWORK,
    });
  }

  return webClient;
}

export const encryptJSON = async (payload, address) => {
  const receiverDid = await address2did(address);

  const { client } = await self();
  const did = client.ceramic.did;

  const encrypted = await did.createDagJWE(payload, [receiverDid, did.id]); // end-to-end encryption.
  return Buffer.from(JSON.stringify(encrypted)).toString('hex');
}

export const decryptJSON = async (hex) => {
  const jwe = Buffer.from(hex, 'hex').toString();

  const { client } = await self();
  const did = client.ceramic.did;

  return await did.decryptDagJWE(JSON.parse(jwe));
}
