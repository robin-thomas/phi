import { PrivateKey } from '@textile/hub';

const getIdentity = async () => {
  const key = `${process.env.APP_NAME}_identity`;

  const stored = localStorage.getItem(key);
  if (!stored) {
    const identity = await PrivateKey.fromRandom();
    localStorage.setItem(key, identity.toString());
    return identity;
  }

  return PrivateKey.fromString(stored);
}

export const getClient = async (clientClass) => {
  const client = await clientClass.withKeyInfo({ key: process.env.TEXTILE_KEY, secret: '' });
  const identity = await getIdentity();
  await client.getToken(identity);

  return client;
}

export const addThreadListener = (client, callback, threadID) => {
  const filters = [{ actionTypes: ['CREATE'] }];
  client.listen(threadID, filters, callback);
}
