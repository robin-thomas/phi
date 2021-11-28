import { useState, useEffect } from 'react';
import { useMoralis } from 'react-moralis';
import Box from '@mui/material/Box';

import ChatBox from './ChatBox';
import Messages from './Messages';

import Utils from '../../utils';
import Thread from '../../utils/textile/thread';
import { useAppContext } from '../hooks';

const Chat = ({ sent }) => {
  const [chats, setChats] = useState(null);
  const { user } = useMoralis();
  const { activeContact, threadID, setThreadID } = useAppContext();

  useEffect(() => {
    if (activeContact) {
      (async () => {
        const thread = await Utils.getInstance(Thread);

        const me = user.get('ethAddress');
        const [from, to] = sent ? [me, activeContact] : [activeContact, me];

        let result = null;
        try {
          result = await thread.invite(me).get(from, to);
        } catch (err) {
          result = await thread.invite(me).get(to, from);
        }

        if (result) {
          setThreadID(result.dbInfo.threadID);
        }
      })();
    }
  }, [activeContact, setThreadID]);

  useEffect(() => {
    if (threadID) {
      Utils.getInstance(Thread)
        .then(thread => thread.chat(threadID, user.get('ethAddress')).getAll())
        .then(chats => {
          const results = [];

          for (let i = 0; i < chats.length; ++i) {
            const messages = [chats[i].message];
            if (chats[i].attachments.length > 0) {
              results.push({ ...chats[i], messages });
              continue;
            }

            const j = i + 1;
            while (j < chats.length && chats[i].from === chats[j].from) {
              // if differnce between 2 messages are greater than 10 minutes,
              // dont club then together.
              const prev = new Date(chats[i].date).getTime();
              const curr = new Date(chats[j].date).getTime();
              const diff = curr - prev;
              if (diff > (5 * 60 * (10 ** 3))) {
                break;
              }

              messages.push(chats[j].message);
              ++j;
            }

            if (j < chats.length) {
              results.push({ ...chats[i], messages, date: chats[j].date });
            } else {
              results.push({ ...chats[i], messages, date: chats[j - 1].date });
            }

            i = j - 1;
          }

          setChats(results);
        });
    }
  }, [threadID]);

  useEffect(() => {
    const listener = async (reply, err) => {
      const thread = await Utils.getInstance(Thread);
      const result = await thread.chat(threadID, user.get('ethAddress')).listen(reply, err);

      if (result?.from) {
        setChats(_chats => ([..._chats, { ...result, messages: [result.message] } ]));
      }
    };

    if (threadID) {
      Utils.getInstance(Thread)
        .then(thread => thread.listen(listener, threadID));
    }
  }, [threadID]);

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
