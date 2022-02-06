import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import format from 'date-fns/format';
import propTypes from 'prop-types';

import styles from './Message.module.css';
import MessageImage from './MessageImage';
import { useAppContext } from '@/modules/common/hooks';
import { Avatar } from '@/modules/profile/components';
import { getProfile } from '@/modules/profile/utils/ceramic';

const Message = ({ chat }) => {
  const { address } = useAppContext();

  const [name, setName] = useState('');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const retrieveProfile = async () => {
      // you sent the message.
      if (address === chat.from) {
        setProfile(undefined);
      } else {
        // you received the message.
        const _profile = await getProfile(chat.from);
        setProfile(_profile);
      }
    }

    retrieveProfile();
  }, [chat, address]);

  useEffect(() => {
    if (profile !== null) {
      setName(profile === undefined ? 'You' : profile?.name);
    }
  }, [profile]);

  if (name === '') {
    return null;
  }

  return (
    <Box sx={{ mb: 1 }}>
      <Grid container justifyContent={name === 'You' ? 'flex-end': 'flex-start'}>
        {name !== 'You' && (
          <Grid item xs={1}>
            <Avatar profile={profile} mini />
          </Grid>
        )}
        <Grid container item xs={7} justifyContent={name === 'You' ? 'flex-end': 'flex-start'}>
          <Stack>
            {chat.messages.map(message => (
              <Grid key={message} container justifyContent={name === 'You' ? 'flex-end': 'flex-start'}>
                <div className={`${styles.message} ${name === 'You' ? styles.self : ''}`}>
                  {message}
                </div>
              </Grid>
            ))}
            {chat.attachments.map(image => (
              <div key={image.name} className={`${styles.messageImage} ${name === 'You' ? styles.selfImage : ''}`}>
                <MessageImage address={chat.to} attachment={image} />
              </div>
            ))}
            <div className={`${styles.name} ${name === 'You' ? styles.nameRight : ''}`}>
              {name}
              &nbsp;&nbsp;•&nbsp;&nbsp;
              {format(new Date(chat.date), 'MMM d HH:mm aaa')}
            </div>
          </Stack>
        </Grid>
        {name === 'You' && (
          <Grid container item xs={1} justifyContent="flex-end">
            <Avatar profile={profile} mini />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

Message.propTypes = {
  chat: propTypes.object.isRequired,
};

export default Message;
