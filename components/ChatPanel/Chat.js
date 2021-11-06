import { useCallback, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import SimpleBar from 'simplebar-react';

import ChatBox from './ChatBox';

import Utils from '../../utils';
import Ceramic from '../../utils/ceramic';
import Thread from '../../utils/textile/thread';
import { useAppContext } from '../hooks';

const Chat = ({ sent }) => {
  const { activeContact } = useAppContext();
  const [threadID, setThreadID] = useState(null);

  useEffect(() => activeContact && getThreadID().then(setThreadID), [activeContact, getThreadID]);

  useEffect(() => {
    if (threadID) {
      (async () => {
        const thread = await Utils.getInstance(Thread);
        const _chats = await thread.getAll(threadID);
        console.log('_chats', _chats);
      })();
    }
  }, [threadID]);

  const getThreadID = useCallback(async () => {
    const thread = await Utils.getInstance(Thread);
    const ceramic = await Utils.getInstance(Ceramic);

    const from = sent ? ceramic.address : activeContact;
    const to = sent ? activeContact : ceramic.address;

    const { dbInfo } = await thread.invite().findBy({ from, to });
    return dbInfo.threadID;
  }, [activeContact, sent]);

  return (
    <>
      <Box mt={5} width="90%" height="65%">
        <SimpleBar style={{ height: '100%' }}>
          <div>Hello World</div>
        </SimpleBar>
      </Box>
      <Box position="absolute" bottom={80} width="90%">
        <ChatBox />
      </Box>
    </>
  )
}

export default Chat;
