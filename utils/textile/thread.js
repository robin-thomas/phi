import { Client, ThreadID } from '@textile/hub';

import Textile from './base';
import invites from '../../config/invites.json';

class Thread extends Textile {
  constructor() {
    super(Client);
  }

  static getInstance() {
    return (async () => await new Thread().build())();
  }

  async join(callback) {
    try {
      await this.client.joinFromInfo(invites.dbInfo);
    } catch (err) {
      // fails if tries to join again. Hence ignoring.
    }

    this.listen(callback);
  }

  listen(callback) {
    const filters = [{ actionTypes: ['CREATE'] }];
    this.client.listen(ThreadID.fromString(invites.threadID), filters, callback);
  }

  async sendRequest(to) {
    console.debug('Sending chat request to: ', to);
    const [from] = await window.ethereum.enable();
    const threadID = ThreadID.fromString(invites.threadID);
    await this.client.create(threadID, 'invites', [{ to, from }]);
  }
};

export default Thread;
