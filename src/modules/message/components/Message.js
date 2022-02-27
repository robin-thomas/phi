import Box from '@mui/material/Box';
import propTypes from 'prop-types';

import MessageReceived from './MessageReceived';
import MessageSent from './MessageSent';
import { useAppContext } from '@/modules/common/hooks';

const Message = ({ chat }) => {
  const { profile } = useAppContext();

  return (
    <Box sx={{ mb: 1 }}>
      {profile?.address === chat.from ? <MessageSent chat={chat} /> : <MessageReceived chat={chat} />}
    </Box>
  );
}

Message.propTypes = {
  chat: propTypes.object.isRequired,
};

export default Message;
