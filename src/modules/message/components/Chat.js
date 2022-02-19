import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';

import Messages from '.';
import { messageGrouper } from '../utils/list';
import ChatUtil from '../utils/textile/chat';
import { ChatBox } from '@/modules/chatbox/components';
import { useAppContext } from '@/modules/common/hooks';

const Chat = () => {
  const [chats, setChats] = useState(null);
  const { threadIDs, activeContact, updateChats } = useAppContext();

  useEffect(() => {
    const loadChats = async () => {
      const chats = await ChatUtil.getAll(threadIDs[activeContact]);
      if (chats.length > 0) {
        setChats(messageGrouper(chats));
      }
    }

    if (threadIDs[activeContact]) {
      loadChats();
    }
  }, [threadIDs, activeContact, updateChats]);

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
