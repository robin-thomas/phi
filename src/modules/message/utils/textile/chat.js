import { Client, ThreadID, Query } from '@textile/hub';
import LRU from 'lru-cache';

import { cacheChatConfig } from '../../constants/cache';
import { TEXTILE_COLLECTION_CHAT } from '@/modules/common/constants/textile';
import { decryptJSON } from '@/modules/common/utils/ceramic';
import { getClient, addThreadListener } from '@/modules/common/utils/textile';

const cache = new LRU(cacheChatConfig);
const collection = TEXTILE_COLLECTION_CHAT;

const _decrypt = (address) => async (chat) => {
  try {
    chat.message = await decryptJSON(chat.message, address);
  } catch (err) { }

  return chat;
}

const Chat = {
  address: null,

  setAddress: (address) => {
    Chat.address = address;
  },

  getAll: async (threadID) => {
    const client = await getClient(Client, 'Client');

    if (cache.has(threadID)) {
      console.debug('Retrieving all chats from cache');
      return cache.get(threadID);
    }

    console.debug('Retrieving all chat requests from textile, and decrypting it');
    const chats = await client.find(ThreadID.fromString(threadID), collection, new Query());
    const results = await Promise.all(chats.map(_decrypt(Chat.address)));

    cache.set(threadID, results);
    return results;
  },

  listen: async (threadID, contact, _callback) => {
    const callback = async (reply, err) => {
      let result = null;

      if (!err) {
        if ([reply?.instance?.from, reply?.instance.to].includes(Chat.address)) {
          console.debug('Received a chat message from: ', reply.instance?.from);

          result = await _decrypt(Chat.address)(reply.instance);

          const results = cache.get(threadID) || [];
          cache.set(threadID, [...results, result]);
        }
      }

      _callback(result);
    };

    const client = await getClient(Client, 'Client');
    await Chat.getAll(threadID);

    console.debug(`Listening to chats from: ${contact}`);
    return addThreadListener(client, callback, ThreadID.fromString(threadID), collection);
  },
}

export default Chat;
