import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import { useMoralis } from 'react-moralis';

import Messages from '.';
import ChatBox from '../../chatbox/components/ChatBox';
import { messageGrouper } from '../utils/list';
import ChatUtil from '../utils/textile/chat';
import { useAppContext } from '@/modules/common/hooks';
import { getInvite } from '@/modules/friendrequest/utils';

const Chat = () => {
  const [chats, setChats] = useState(null);
  const { user } = useMoralis();
  const { activeContact, threadID, setThreadID } = useAppContext();

  useEffect(() => {
    if (activeContact) {
      const me = user.get('ethAddress');
      const result = getInvite(activeContact, me) || getInvite(me, activeContact);
      if (result) {
        setThreadID(result.dbInfo.threadID);
      }
    }
  }, [activeContact, setThreadID]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const loadChats = async () => {
      ChatUtil.setThreadID(threadID);
      ChatUtil.setAddress(user.get('ethAddress'));

      const chats = await ChatUtil.getAll();

      return messageGrouper(chats);
    }

    if (threadID) {
      loadChats().then(setChats);
    }
  }, [threadID]); // eslint-disable-line react-hooks/exhaustive-deps

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
