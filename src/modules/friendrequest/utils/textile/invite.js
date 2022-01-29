import { cacheInviteConfig } from '../../constants/cache';
import { TEXTILE_COLLECTION_INVITE } from '../../constants/textile';
import Base from './base';
import chatSchema from '@/config/schema/chat.json';
import { encryptJSON, decryptJSON } from '@/modules/common/utils/ceramic';
import { addThreadListener } from '@/modules/common/utils/textile';
import { TEXTILE_COLLECTION_CHAT } from '@/modules/message/constants/textile';

const base = new Base(cacheInviteConfig, TEXTILE_COLLECTION_INVITE);

const _newThread = async (client) => {
  const thread = await client.newDB();
  const dbInfo = await client.getDBInfo(thread);

  // Create chat collection in the new thread.
  await client.newCollection(thread, { name: TEXTILE_COLLECTION_CHAT, schema: chatSchema });

  return {
    threadID: thread.toString(),
    dbInfo,
  };
}

const _decrypt = (address) => async (result) => {
  try {
    result.dbInfo = await decryptJSON(result.dbInfo, address);
  } catch (err) {}

  return result;
}

const Invite = {
  loadInvites: async (address) => {
    console.debug('Retrieving all chat invites from textile');
    await base.loadMessages(address, _decrypt(address));
  },

  get: (from, to) => {
    console.debug(`Retrieving chat invite from: ${from}, and to: ${to}`);
    return base.get(from, to);
  },

  getAll: () => {
    console.debug('Retrieving all received/(approved sent) chat invites from cache');

    return {
      received: base.received(),
      sent: base.sent(),
    };
  },

  post: async (to) => {
    // Verify whether a request has been sent before.
    const key = base.address() + to;
    if (base.cache().has(key)) {
      throw new Error('Have already sent a chat request to this address before');
    }

    // Create a new thread for chat.
    const payload = await _newThread(base.client());
    const encrypted = await encryptJSON(payload, base.address(), to);

    console.debug('Sending chat request to: ', to);
    const params = { to, from: base.address(), date: new Date().toISOString(), dbInfo: encrypted };
    await base.post(params);
  },

  addThreadListener: async (_callback) => {
    const callback = async (reply, err) => {
      const result = await base.callback(reply, err, _decrypt);

      if (result?.instance) {
        const sent = base.address() === result.instance.from;
        _callback({ sent, address: sent ? result.instance.to : result.instance.from });
      }
    }

    console.debug('Listening to chat invites thread');
    addThreadListener(base.client(), callback, base.threadID());
  }
}

export default Invite;
