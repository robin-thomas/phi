import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';

import Messages from '.';
import { messageGrouper } from '../utils/list';
import ChatUtil from '../utils/textile/chat';
import { ChatBox } from '@/modules/chatbox/components';
import { useAppContext } from '@/modules/common/hooks';

const Chat = () => {
  const [chats, setChats] = useState(null);
  const { threadIDs, address, activeContact, threadID, setThreadID } = useAppContext();

  useEffect(() => {
    if (threadIDs[activeContact]) {
      setThreadID(threadIDs[activeContact]);
    }
  }, [threadIDs, activeContact, setThreadID]);

  useEffect(() => {
    const loadChats = async () => {
      const chats = await ChatUtil.getAll(threadID);
      if (chats.length > 0) {
        setChats(messageGrouper(chats));
      }
    }

    if (threadID) {
      loadChats();
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
