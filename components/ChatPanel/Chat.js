import { useCallback, useState, useEffect } from 'react';
import Box from '@mui/material/Box';

import ChatBox from './ChatBox';
import Messages from './Messages';

import Utils from '../../utils';
import Ceramic from '../../utils/ceramic';
import Thread from '../../utils/textile/thread';
import { useAppContext } from '../hooks';

const Chat = ({ sent }) => {
  const [chats, setChats] = useState(null);
  const [threadID, setThreadID] = useState(null);
  const { activeContact } = useAppContext();

  useEffect(() => activeContact && getThreadID().then(setThreadID), [activeContact, getThreadID]);

  useEffect(() => {
    if (threadID) {
      Utils.getInstance(Thread)
        .then(thread => thread.chat(threadID).getAll())
        .then(setChats);
    }
  }, [threadID]);

  useEffect(() => {
    if (threadID) {
      Utils.getInstance(Thread).then((thread) => thread.listen(listener, threadID));
    }
  }, [threadID, listener]);

  const getThreadID = useCallback(async () => {
    const thread = await Utils.getInstance(Thread);
    const ceramic = await Utils.getInstance(Ceramic);

    const from = sent ? ceramic.address : activeContact;
    const to = sent ? activeContact : ceramic.address;

    try {
      const { dbInfo } = await thread.invite().get(from, to);
      return dbInfo.threadID;
    } catch (err) {
      const { dbInfo } = await thread.invite().get(to, from);
      return dbInfo.threadID;
    }
  }, [activeContact, sent]);

  const listener = useCallback(async (reply, err) => {
    const thread = await Utils.getInstance(Thread);
    const result = await thread.chat().listen(reply, err);

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
