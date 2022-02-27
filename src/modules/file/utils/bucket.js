import { Buckets } from '@textile/hub';
import LRU from 'lru-cache';

import { bucketCacheConfig } from '../constants/cache';
import { getClient } from '@/modules/common/utils/textile';

const keyCache = new LRU(bucketCacheConfig);

const Bucket = {
  client: null,

  init: async (bucketKey = null) => {
    if (!Bucket.client) {
      Bucket.client = await getClient(Buckets, 'Buckets');
    }

    if (bucketKey) {
      Bucket.client.withThread(bucketKey.threadID);
    }
  },

  getKey: async (bucketName) => {
    if (keyCache.has(bucketName)) {
      console.debug('Found key in cache. Not downloading from bucket');
      return keyCache.get(bucketName);
    }

    await Bucket.init();

    console.debug(`Retrieving textile key for bucketName: ${bucketName}`);
    const result = await Bucket.client.getOrCreate(bucketName);
    if (!result?.root) {
      throw new Error(`Failed to open bucket ${bucketName}`);
    }

    keyCache.set(bucketName, { key: result.root.key, threadID: result.threadID });
    return keyCache.get(bucketName);
  },

  upload: async (bucketKey, path, file, options = {}) => {
    console.debug('Uploading to textile bucket, with path: ', path);

    await Bucket.init(bucketKey);

    const uploaded = await Bucket.client.pushPath(bucketKey.key, path, file, options);
    console.debug('Uploaded to textile bucket successfully, with path', path);

    return uploaded;
  },

  download: async (bucketKey, path) => {
    console.debug(`Downloading from textile bucket with path: ${path}`);

    await Bucket.init(bucketKey);

    const arrays = [];
    const results = await Bucket.client.pullPath(bucketKey.key, path);
    for await (const result of results) {
      arrays.push(result);
    }

    const size = arrays.reduce((a, b) => a + b.byteLength, 0);
    const result = new Uint8Array(size);

    let offset = 0;
    for (const arr of arrays) {
      result.set(arr, offset);
      offset += arr.byteLength;
    }

    return result;
  },
}

export default Bucket;
