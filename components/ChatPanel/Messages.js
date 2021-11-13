import { useRef, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import SimpleBar from 'simplebar-react';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

import Message from './Message';

const ChatSkeletonLeft = () => (
  <Grid container>
    <Grid item xs={1}>
      <Skeleton variant="circular" width={50} height={50} />
    </Grid>
    <Grid item xs={11}>
      <Skeleton variant="rectangular" width={400} height={60} />
    </Grid>
    <Grid item xs={1} />
    <Grid item xs={3}>
      <Skeleton variant="text" />
    </Grid>
  </Grid>
)

const ChatSkeletonRight = () => (
  <Grid container justifyContent="flex-end">
    <Grid container item xs={11} justifyContent="flex-end">
      <Skeleton variant="rectangular" width={400} height={60} />
    </Grid>
    <Grid container item xs={1} justifyContent="flex-end">
      <Skeleton variant="circular" width={50} height={50} />
    </Grid>
    <Grid item xs={3}>
      <Skeleton variant="text" />
    </Grid>
    <Grid item xs={1} />
  </Grid>
)

const Messages = ({ chats }) => {
  const ref = useRef();

  const scrollToBottom = () => {
    ref.current.recalculate();
    ref.current.getScrollElement().scrollTo({ top: ref.current.getScrollElement().scrollHeight, behavior: 'smooth' });
  }

  useEffect(() => {
    setTimeout(scrollToBottom, 500);
  }, [chats]);

  return (
    <SimpleBar ref={ref} style={{ height: '100%' }}>
      {chats === null ? (
        <Stack spacing={4}>
          <ChatSkeletonLeft />
          <ChatSkeletonRight />
          <ChatSkeletonLeft />
        </Stack>
      ) : chats.map(chat => <Message key={chat._id} chat={chat} />)}
    </SimpleBar>
  )
}

export default Messages;
