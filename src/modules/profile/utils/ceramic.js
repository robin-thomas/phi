import LRU from 'lru-cache';

import { cacheConfig } from '../constants/cache';
import { profileDefaults } from '../constants/profile';
import { address2did, client, self } from '@/modules/common/utils/ceramic';

const cache = new LRU(cacheConfig);

const setDefaults = (profile, address = null) => {
  profile = profile || {};
  profile.address = address || profile.address;
  profile.name = profile?.name || profileDefaults.name;
  profile.description = profile?.description || profileDefaults.description;
  return profile;
}

export const getProfile = async (address, selfProfile = false, provider = null) => {
  if (selfProfile) {
    console.debug('Retrieving authenticated ceramic basicProfile');

    const authenticatedClient = await self(address, provider);
    const profile = await authenticatedClient.get('basicProfile');

    return setDefaults(profile, address);
  }

  console.debug('Searching ceramic profile for: ', address);

  if (cache.has(address)) {
    console.debug('Found profile in cache. Not downloading from ceramic');
    return cache.get(address);
  }

  const did = await address2did(address);
  if (!did) {
    return null;
  }

  console.debug('Retrieving un-authenticated ceramic basicProfile');
  const profile = await client().get('basicProfile', did);

  cache.set(address, setDefaults(profile, address));
  return cache.get(address);
}

export const updateProfile = async (address, key, value) => {
  const profile = await getProfile(address, true /* self profile */);

  const updateProfile = {...profile, [key]: value};
  console.debug('Updating ceramic basicProfile to: ', updateProfile);

  const authenticatedClient = await self(address);
  return await authenticatedClient.set('basicProfile', updateProfile);
}

export const updateProfileImage = async (address, ipfsLink, file) => {
  const profile = await getProfile(address, true /* self profile */);

  const image = {
    original: {
      src: `ipfs://${ipfsLink.path.path.replace('/ipfs/', '')}`,
      mimeType: file.type,
      ...profileDefaults.avatar,
    },
  };

  const updateProfile = { ...profile, image };
  console.debug('Updating ceramic basicProfile to: ', updateProfile);

  const authenticatedClient = await self();
  return await authenticatedClient.set('basicProfile', updateProfile);
}

export const searchProfiles = (keyword) => {
  keyword = keyword.toLowerCase();
  console.debug('Searching among contacts with keyword: ', keyword);

  const results = [];

  // exact match to an address.
  if (cache.keys().includes(keyword)) {
    return keyword;
  }

  // search for names.
  for (const address of cache.keys()) {
    const profile = cache.get(address);
    const name = profile?.name?.toLowerCase() || '';

    if (name.startsWith(keyword)) {
      results.push(address);
    }
  }

  return results;
}
