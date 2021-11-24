import SuperfluidSDK from '@superfluid-finance/js-sdk';
import { Web3Provider } from '@ethersproject/providers';

class Superfluid {
  static getInstance() {
    return (async () => await new Superfluid().build())();
  }

  static getClassName() {
    return 'Superfluid';
  }

  async build() {
    this.sf = new SuperfluidSDK.Framework({
      ethers: new Web3Provider(window.ethereum),
      tokens: ['fDAI'],
    });
    await this.sf.initialize();

    return this;
  }

  async loan({ from, to, amount, months }, callback) {
    const amountPerMonth = Math.ceil(amount / months);
    const flowRate = Math.ceil((amountPerMonth * 1e18) / (3600 * 24 * 30));

    await this.sf.cfa.createFlow({
      superToken: this.sf.tokens.fDAIx.address,
      sender: to,
      receiver: from,
      flowRate: flowRate.toString(),
      onTransaction: callback,
    });
  }
}

export default Superfluid;
