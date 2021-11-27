import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import format from 'date-fns/format';
import Stack from '@mui/material/Stack';

import MessageImage from './MessageImage';

import Utils from '../../utils';
import Ceramic from '../../utils/ceramic';
import Bucket from '../../utils/textile/bucket';
import { useAppContext } from '../hooks';
import styles from './Message.module.css';

const Message = ({ chat }) => {
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const { profileKey } = useAppContext();

  useEffect(() => {
    (async () => {
      const ceramic = await Utils.getInstance(Ceramic);

      const profile = await ceramic.getProfile(ceramic.address === chat.from ? undefined : chat.from);
      setName(ceramic.address === chat.from ? 'You' : profile?.name);

      if (profile?.image) {
        const bucket = await Utils.getInstance(Bucket);
        setProfilePic(await bucket.getImage(profileKey, chat.from, profile.image.original.mimeType));
      }
    })();
  }, [chat, profileKey]);

  return name !== '' ? (
    <Box sx={{ mb: 3 }}>
      <Grid container justifyContent={name === 'You' ? 'flex-end': 'flex-start'}>
        {name !== 'You' && (
          <Grid item xs={1}>
            <Avatar src={profilePic} width={50} height={50} />
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
            <Avatar src={profilePic} width={50} height={50} />
          </Grid>
        )}
      </Grid>
    </Box>
  ) : null;
}

export default Message;
