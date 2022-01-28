import { Client, ThreadID, Query } from '@textile/hub';
import LRU from 'lru-cache';

import { cacheChatConfig } from '../../constants/cache';
import { encryptJSON, decryptJSON } from '@/modules/common/utils/ceramic';
import { getClient, addThreadListener } from '@/modules/common/utils/textile';

const cache = new LRU(cacheChatConfig);
const collection = process.env.TEXTILE_COLLECTION_CHAT;

const _decrypt = async (chat) => {
  try {
    chat.message = await decryptJSON(chat.message);
  } catch (err) { }

  return chat;
}

const Chat = {
  client: null,
  address: null,
  threadID: null,

  setThreadID: (threadID) => {
    Chat.threadID = ThreadID.fromString(threadID);
  },

  setAddress: (address) => {
    Chat.address = address;
  },

  loadClient: async () => {
    if (!Chat.client) {
      Chat.client = await getClient(Client);
    }
  },

  getAll: async () => {
    const threadID = Chat.threadID.toString();

    await Chat.loadClient();

    if (cache.has(threadID)) {
      console.debug('Retrieving all chats from cache');
      return cache.get(threadID);
    }

    console.debug('Retrieving all chat requests from textile, and decrypting it');
    const chats = await Chat.client.find(Chat.threadID, collection, new Query());
    const results = await Promise.all(chats.map(_decrypt));

    cache.set(threadID, results);
    return results;
  },

  post: async (to, message, attachments = []) => {
    console.debug('Sending chat message to: ', to);

    const encrypted = await encryptJSON(message, to);
    const params = { from: Chat.address, to, message: encrypted, attachments, date: new Date().toISOString() };
    await this._client.create(Chat.threadID, collection, [params]);
  },

  listen: (_callback) => {
    const callback = async (reply, err) => {
      let result = null;

      if (!err && reply?.collectionName === collection) {
        if ([reply?.instance?.from, reply?.instance.to].includes(Chat.address)) {
          console.debug('Received a chat message from: ', reply?.instance?.from);

          result = await _decrypt(reply.instance);
          cache.set(result.from + result.to, result);
        }
      }

      _callback(result);
    };

    addThreadListener(Chat.client, callback, Chat.threadID);
  },
}

export default Chat;
