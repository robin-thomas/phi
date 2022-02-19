import { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import format from 'date-fns/format';
import propTypes from 'prop-types';

import styles from './Message.module.css';
import MessageImage from './MessageImage';
import { Avatar } from '@/modules/profile/components';
import { getProfile } from '@/modules/profile/utils/ceramic';

const MessageReceived = ({ chat }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => getProfile(chat.from).then(setProfile), [chat]);

  return (
    <Grid container justifyContent="flex-start">
      <Grid item xs={1}>
        <Avatar profile={profile} mini />
      </Grid>
      <Grid container item xs={7} justifyContent="flex-start">
        <Stack>
          {chat.messages.map(message => (
            <Grid key={message} container justifyContent="flex-start">
              <div className={styles.message}>
                {message}
              </div>
            </Grid>
          ))}
          {chat.attachments.map(image => (
            <div key={image.name} className={styles.messageImage}>
              <MessageImage address={chat.to} attachment={image} />
            </div>
          ))}
          <div className={styles.name}>
            {profile?.name}
            &nbsp;&nbsp;•&nbsp;&nbsp;
            {format(new Date(chat.date), 'MMM d HH:mm aaa')}
          </div>
        </Stack>
      </Grid>
    </Grid >
  )
}

MessageReceived.propTypes = {
  chat: propTypes.object.isRequired,
};

export default MessageReceived;
