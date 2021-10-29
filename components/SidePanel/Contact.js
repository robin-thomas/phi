import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import CheckIcon from '@mui/icons-material/Check';

import Bucket from '../../utils/bucket';
import { useAppContext } from '../hooks';
import styles from './Header.module.css';

const Contact = ({ profile, address }) => {
  const { profileKey } = useAppContext();

  const [src, setSrc] = useState(null);

  useEffect(() => {
    if (address && profile?.image && profileKey) {
      (async () => {
        const bucket = await Bucket.getInstance();
        setSrc(await bucket.getImage(profileKey, address.toLowerCase(), profile.image.original.mimeType));
      })();
    }
  }, [address, profile, profileKey]);

  if (profile?.notfound === null) {
    return (
      <Box sx={{ mt: 2}}>
        <span>Found none!</span>
      </Box>
    );
  }

  if (!profile?.name) {
    return null;
  }

  return (
    <Card
      sx={{ mt: 7 }}
      style={{
        backgroundColor: 'transparent',
        boxShadow: 'none',
      }}
    >
      <CardHeader
        avatar={<Avatar src={src} width={50} height={50} />}
        title={profile?.name}
        subheader={profile?.description}
        action={
          <Tooltip title="Add new Contact" arrow placement="top">
            <IconButton>
              <CheckIcon />
            </IconButton>
          </Tooltip>
        }
        classes={{
          title: styles.title,
          subheader: styles.subheader,
        }}
      />
    </Card>
  )
}

export default Contact;
