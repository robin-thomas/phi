import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import CheckIcon from '@mui/icons-material/Check';

import Utils from '../../utils';
import Ceramic from '../../utils/ceramic';
import Bucket from '../../utils/textile/bucket';
import Thread from '../../utils/textile/thread';
import { useAppContext } from '../hooks';
import styles from './Header.module.css';

const Contact = ({ address, active, close, onClick, checkingContact, setCheckingContact }) => {
  const { profileKey, setLoadingContacts } = useAppContext();

  const [src, setSrc] = useState(null);
  const [profile, setProfile] = useState(null);

  // load the profile.
  useEffect(() => {
    if (address && checkingContact) {
      (async () => {
        const ceramic = await Utils.getInstance(Ceramic);
        const _profile = await ceramic.getProfile(address);
        setProfile(_profile || { notfound: null });
        setCheckingContact && setCheckingContact(false);
      })();
    }
  }, [address, checkingContact, setCheckingContact]);

  // load the profile pic.
  useEffect(() => {
    if (address && profileKey && profile?.image) {
      (async () => {
        const bucket = await Utils.getInstance(Bucket);
        setSrc(await bucket.getImage(profileKey, address.toLowerCase(), profile.image.original.mimeType));
      })();
    }
  }, [address, profile, profileKey]);

  const addNewContact = async () => {
    setLoadingContacts(true);

    try {
      const thread = await Utils.getInstance(Thread);
      await thread.invite().post(address.toLowerCase());
      close && close();
    } catch (err) {
      setLoadingContacts(false);
      alert(err.message);
    }
  }

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

  const action = close ? (
    <Tooltip title="Add new Contact" arrow placement="top">
      <IconButton onClick={addNewContact}>
        <CheckIcon />
      </IconButton>
    </Tooltip>
  ) : undefined;

  return (
    <Card
      sx={{
        mt: 1,
        backgroundColor: 'transparent',
        boxShadow: 'none',
        ...(active ? {
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2))',
        } : {}),
        ...(!close ? {
          cursor: 'pointer',
          '&:hover': {
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1))',
          },
        } : {}),
      }}
      onClick={onClick}
    >
      <CardHeader
        avatar={<Avatar src={src} width={50} height={50} />}
        title={profile?.name}
        subheader={profile?.description}
        action={action}
        classes={{
          title: styles.title,
          subheader: styles.subheader,
        }}
      />
    </Card>
  )
}

export default Contact;
