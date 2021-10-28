import { Buckets, Client, PrivateKey } from '@textile/hub';

class Bucket {
  static getInstance() {
    return (async () => {
      const bucket = new Bucket();
      await bucket.build();

      return bucket;
    })();
  }

  async build() {
    this.client = await Buckets.withKeyInfo({ key: process.env.TEXTILE_KEY, secret: '' });
    const identity = await this.getIdentity();
    await this.client.getToken(identity);
  }

  async getIdentity() {
    console.debug('Retrieving textile identity');
    const key = `${process.env.APP_NAME}_identity`;

    const stored = localStorage.getItem(key);
    if (!stored) {
      const identity = await PrivateKey.fromRandom();
      localStorage.setItem(key, identity.toString());
      return identity;
    }

    return PrivateKey.fromString(stored);
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
};

export default Bucket;
