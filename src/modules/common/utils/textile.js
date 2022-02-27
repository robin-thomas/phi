import { PrivateKey } from '@textile/hub';

import { TEXTILE_KEY } from '../constants/textile';
import { APP_NAME } from '@/app/config/app';

let client = {};

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

export const getClient = async (clientClass, className) => {
  if (!client[className]) {
    client[className] = await clientClass.withKeyInfo({ key: TEXTILE_KEY, secret: '' });
    const identity = await getIdentity();
    await client[className].getToken(identity);
  }

  return client[className];
}

export const addThreadListener = (client, callback, threadID, collection = null) => {
  const filters = [{ actionTypes: ['CREATE'] }];
  if (collection) {
    filters[0].collectionName = collection;
  }

  return client.listen(threadID, filters, callback);
}
