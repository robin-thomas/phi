import LRU from 'lru-cache';
import { Buckets } from '@textile/hub';

import Textile from './base';

const imageCache = new LRU({
  max: 50,
  maxAge: 60 * 60 * 1000,
});

class Bucket extends Textile {
  constructor() {
    super(Buckets);
  }

  static getInstance() {
    return (async () => await new Bucket().build())();
  }

  static getClassName() {
    return 'Bucket';
  }

  async getKey(bucketName) {
    console.debug(`Retrieving textile key for bucketName: ${bucketName}`);
    const result = await this.client.getOrCreate(bucketName);
    if (!result?.root) {
      throw new Error(`Failed to open bucket ${bucketName}`);
    }

    return { key: result.root.key, threadID: result.threadID };
  }

  async upload(bucketKey, path, file) {
    console.debug(`Uploading to textile bucket with path: ${path}`);
    this.client.withThread(bucketKey.threadID);
    return await this.client.pushPath(bucketKey.key, path, file);
  }

  async download(bucketKey, path) {
    console.debug(`Downloading from textile bucket with path: ${path}`);
    this.client.withThread(bucketKey.threadID);
    const results = await this.client.pullPath(bucketKey.key, path);

    const arrays = [];
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
  }

  async getImage(bucketKey, address, mimeType) {
    if (imageCache.has(address)) {
      console.debug('Found image in cache. Not downloading from bucket');
      return imageCache.get(address);
    }

    const buf = await this.download(bucketKey, `${address}/pic`);
    const url = URL.createObjectURL(new Blob([buf], { type: mimeType }));

    imageCache.set(address, url);
    return imageCache.get(address);
  }
};

export default Bucket;
