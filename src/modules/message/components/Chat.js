import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';

import Messages from '.';
import { messageGrouper } from '../utils/list';
import ChatUtil from '../utils/textile/chat';
import { ChatBox } from '@/modules/chatbox/components';
import { useAppContext } from '@/modules/common/hooks';
import { getInvite } from '@/modules/friendrequest/utils';

const Chat = () => {
  const [chats, setChats] = useState(null);
  const { address, activeContact, threadID, setThreadID } = useAppContext();

  useEffect(() => {
    const getThread = async () => {
      const result = getInvite(activeContact, address) || getInvite(address, activeContact);
      if (result) {
        setThreadID(result.dbInfo.threadID);
      }
    }

    if (activeContact) {
      getThread();
    }
  }, [address, activeContact, setThreadID]);

  useEffect(() => {
    const loadChats = async () => {
      ChatUtil.setThreadID(threadID);
      ChatUtil.setAddress(address);

      const chats = await ChatUtil.getAll();
      if (chats.length > 0) {
        setChats(messageGrouper(chats));
      }
    }

    if (threadID) {
      loadChats().then(() => ChatUtil.listen(loadChats));
    }
  }, [threadID, address]);

  return (
    <>
      <Box mt={5} width="90%" height="65%">
        <Messages chats={chats} />
      </Box>
      <Box position="absolute" bottom={80} width="90%">
        <ChatBox />
      </Box>
    </>
  )
}

export default Chat;
