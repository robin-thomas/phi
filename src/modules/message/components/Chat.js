import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';

import Messages from '.';
import ChatBox from '../../chatbox/components/ChatBox';
import { messageGrouper } from '../utils/list';
import ChatUtil from '../utils/textile/chat';
import { useAppContext } from '@/modules/common/hooks';
import { getAddress } from '@/modules/common/utils/address';
import { getInvite } from '@/modules/friendrequest/utils';

const Chat = () => {
  const [chats, setChats] = useState(null);
  const { activeContact, threadID, setThreadID } = useAppContext();

  useEffect(() => {
    const getThread = async () => {
      const me = await getAddress();
      const result = getInvite(activeContact, me) || getInvite(me, activeContact);
      if (result) {
        setThreadID(result.dbInfo.threadID);
      }
    }

    if (activeContact) {
      getThread();
    }
  }, [activeContact, setThreadID]);

  useEffect(() => {
    const loadChats = async () => {
      const address = await getAddress();

      ChatUtil.setThreadID(threadID);
      ChatUtil.setAddress(address);

      const chats = await ChatUtil.getAll();

      return messageGrouper(chats);
    }

    if (threadID) {
      loadChats().then(setChats);
    }
  }, [threadID]);

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
