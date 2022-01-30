import { PrivateKey } from '@textile/hub';

import { TEXTILE_KEY } from '../constants/textile';
import { APP_NAME } from '@/app/config/app';

const getIdentity = async () => {
  const key = `${APP_NAME}_identity`;

  const stored = localStorage.getItem(key);
  if (!stored) {
    const identity = await PrivateKey.fromRandom();
    localStorage.setItem(key, identity.toString());
    return identity;
  }

  return PrivateKey.fromString(stored);
}

export const getClient = async (clientClass) => {
  const client = await clientClass.withKeyInfo({ key: TEXTILE_KEY, secret: '' });
  const identity = await getIdentity();
  await client.getToken(identity);

  return client;
}

export const addThreadListener = (client, callback, threadID) => {
  const filters = [{ actionTypes: ['CREATE'] }];
  client.listen(threadID, filters, callback);
}
