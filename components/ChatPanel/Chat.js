import { useCallback, useState, useEffect } from 'react';
import Box from '@mui/material/Box';

import ChatBox from './ChatBox';
import Messages from './Messages';

import Utils from '../../utils';
import Ceramic from '../../utils/ceramic';
import Thread from '../../utils/textile/thread';
import { useAppContext } from '../hooks';

const Chat = ({ sent }) => {
  const [chats, setChats] = useState([]);
  const [threadID, setThreadID] = useState(null);
  const { activeContact } = useAppContext();

  useEffect(() => activeContact && getThreadID().then(setThreadID), [activeContact, getThreadID]);

  useEffect(() => {
    if (threadID) {
      (async () => {
        const thread = await Utils.getInstance(Thread);
        const _chats = await thread.chat(threadID).getAll();
        setChats(_chats);
      })();
    }
  }, [threadID]);

  useEffect(() => {
    if (threadID) {
      (async () => {
        const thread = await Utils.getInstance(Thread);
        const close = thread.listen(listener, threadID);
        return () => close();
      })();
    }
  }, [threadID, listener]);

  const getThreadID = useCallback(async () => {
    const thread = await Utils.getInstance(Thread);
    const ceramic = await Utils.getInstance(Ceramic);

    const from = sent ? ceramic.address : activeContact;
    const to = sent ? activeContact : ceramic.address;

    const { dbInfo } = await thread.invite().findBy({ from, to });
    return dbInfo.threadID;
  }, [activeContact, sent]);

  const listener = useCallback((reply, err) => !err && reply?.instance && setChats(_chats => ([..._chats, reply.instance])), []);

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
