import { cacheAckConfig } from '../../constants/cache';
import { TEXTILE_COLLECTION_INVITE_ACK } from '../../constants/textile';
import Base from './base';
import { addThreadListener } from '@/modules/common/utils/textile';

const base = new Base(cacheAckConfig, TEXTILE_COLLECTION_INVITE_ACK);

const Ack = {
  loadAcks: async (address) => {
    console.debug('Retrieving all chat acks from textile');
    await base.loadMessages(address);
  },

  get: (from, to) => base.get(from, to),

  post: async (from, to, accepted) => {
    console.debug('Sending chat ack to: ', to);

    const params = { to, from, date: new Date().toISOString(), accepted };
    await base.post(params);
  },

  addThreadListener: () => {
    const callback = async (reply, err) => {
      const result = await base.callback(reply, err);
      if (result?.instance) {
        console.debug('Received a chat ack from: ', result.instance.from);
      }
    }

    console.debug('Listening to chat invite acks thread');
    addThreadListener(base.client(), callback, base.threadID(), TEXTILE_COLLECTION_INVITE_ACK);
  }
}

export default Ack;
