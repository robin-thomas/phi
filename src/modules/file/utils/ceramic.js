import { address2did, self } from '@/modules/common/utils/ceramic';

export const encrypt = async (ab, address) => {
  const receiverDid = await address2did(address);

  const { client } = await self();
  const did = client.ceramic.did;

  const jwe = await did.createJWE(new Uint8Array(ab), [receiverDid, did.id]); // end-to-end encryption.
  return Buffer.from(JSON.stringify(jwe)).toString('hex');
}

export const decrypt = async (hex, address) => {
  const jwe = Buffer.from(hex, 'hex').toString();

  const { client } = await self(address);
  const did = client.ceramic.did;

  return await did.decryptJWE(JSON.parse(jwe));
}
