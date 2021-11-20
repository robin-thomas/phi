import { useCallback, useState, useEffect } from 'react';
import Box from '@mui/material/Box';

import ChatBox from './ChatBox';
import Messages from './Messages';

import Utils from '../../utils';
import Thread from '../../utils/textile/thread';
import { useAppContext } from '../hooks';

const Chat = ({ sent }) => {
  const [chats, setChats] = useState(null);
  const { activeContact, threadID, setThreadID } = useAppContext();

  useEffect(() => {
    if (activeContact) {
      (async () => {
        const thread = await Utils.getInstance(Thread);

        const me = thread.invite()._address;
        const [from, to] = sent ? [me, activeContact] : [activeContact, me];

        let result = null;
        try {
          result = await thread.invite().get(from, to);
        } catch (err) {
          result = await thread.invite().get(to, from);
        }

        setThreadID(result.dbInfo.threadID);
      })();
    }
  }, [activeContact]);

  useEffect(() => {
    if (threadID) {
      Utils.getInstance(Thread)
        .then(thread => thread.chat(threadID).getAll())
        .then(setChats);
    }
  }, [threadID]);

  useEffect(() => {
    if (threadID) {
      Utils.getInstance(Thread)
        .then(thread => thread.listen(listener, threadID));
    }
  }, [threadID, listener]);

  const listener = useCallback(async (reply, err) => {
    const thread = await Utils.getInstance(Thread);
    const result = await thread.chat(threadID).listen(reply, err);

    if (result?.from) {
      setChats(_chats => ([..._chats, result]));
    }
  }, []);

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
