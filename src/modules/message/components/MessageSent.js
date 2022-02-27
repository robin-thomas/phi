import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import format from 'date-fns/format';
import propTypes from 'prop-types';

import styles from './Message.module.css';
import MessageImage from './MessageImage';
import { Avatar } from '@/modules/profile/components';

const MessageSent = ({ chat }) => (
  <Grid container justifyContent="flex-end">
    <Grid container item xs={7} justifyContent="flex-end">
      <Stack>
        {chat.messages.map((message, index) => (
          <Grid key={index} container justifyContent="flex-end">
            <div className={`${styles.message} ${styles.self}`}>
              {message}
            </div>
          </Grid>
        ))}
        {chat.attachments.map(image => (
          <div key={image.name} className={`${styles.messageImage} ${styles.selfImage}`}>
            <MessageImage address={chat.to} attachment={image} />
          </div>
        ))}
        <div className={`${styles.name} ${styles.nameRight}`}>
          You
          &nbsp;&nbsp;•&nbsp;&nbsp;
          {format(new Date(chat.date), 'MMM d HH:mm aaa')}
        </div>
      </Stack>
    </Grid>
    <Grid container item xs={1} justifyContent="flex-end">
      <Avatar mini />
    </Grid>
  </Grid >
)

MessageSent.propTypes = {
  chat: propTypes.object.isRequired,
}

export default MessageSent;
