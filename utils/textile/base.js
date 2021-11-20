import { PrivateKey } from '@textile/hub';

class Base {
  constructor(clientClass, childClass) {
    this.clientClass = clientClass;
    this.childClass = childClass;
  }

  async build() {
    this.client = await this.clientClass.withKeyInfo({ key: process.env.TEXTILE_KEY, secret: '' });
    const identity = await this.getIdentity();
    await this.client.getToken(identity);
    return this;
  }

  async getIdentity() {
    console.debug(`[${this.childClass.getClassName()}]: Retrieving textile identity`);
    const key = `${process.env.APP_NAME}_identity`;

    const stored = localStorage.getItem(key);
    if (!stored) {
      const identity = await PrivateKey.fromRandom();
      localStorage.setItem(key, identity.toString());
      return identity;
    }

    return PrivateKey.fromString(stored);
  }
}

export default Base;
