import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';

import Messages from '.';
import ChatBox from '../../chatbox/components/ChatBox';
import { messageGrouper } from '../utils/list';
import ChatUtil from '../utils/textile/chat';
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

      return messageGrouper(chats);
    }

    if (threadID) {
      loadChats().then(setChats);
    }
  }, [threadID, address]);

  // TODO.
  // useEffect(() => {
  //   const callback = (result) => {
  //     if (result?.from) {
  //       setChats(_chats => ([..._chats, { ...result, messages: [result.message] } ]));
  //     }
  //   };

  //   if (threadID) {
  //     ChatUtil.setThreadID(threadID);
  //     ChatUtil.listen(callback);
  //   }
  // }, [threadID]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Box mt={5} width="90%" height="65%">
        <Messages chats={chats} />
      </Box>
      <Box position="absolute" bottom={80} width="90%">
        <ChatBox threadID={threadID} />
      </Box>
    </>
  )
}

export default Chat;
