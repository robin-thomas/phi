import { Client, ThreadID } from '@textile/hub';

import { TEXTILE_COLLECTION_CHAT } from '@/modules/common/constants/textile';
import { encryptJSON } from '@/modules/common/utils/ceramic';
import { getClient } from '@/modules/common/utils/textile';

const collection = TEXTILE_COLLECTION_CHAT;

const Chat = {
  post: async (threadID, params) => {
    const client = await getClient(Client, 'Client');

    console.debug('Sending chat message to: ', params.to);
    params.attachments = params.attachments || [];

    params.message = await encryptJSON(params.message, params.from, params.to);
    params.date = new Date().toISOString();

    return await client.create(ThreadID.fromString(threadID), collection, [params]);
  },
}

export default Chat;
