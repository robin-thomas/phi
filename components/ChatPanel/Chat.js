import Box from '@mui/material/Box';

import ChatBox from './ChatBox';

const Chat = () => {
  return (
    <>
      <Box position="absolute" bottom={50} width="90%">
        <ChatBox />
      </Box>
    </>
  )
}

export default Chat;
