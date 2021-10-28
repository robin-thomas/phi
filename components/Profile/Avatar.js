import { useEffect, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import MUIAvatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';

import Bucket from '../../utils/bucket';
import { updateProfile } from '../../utils/ceramic';

import { useAppContext } from '../hooks';

const Pic = ({ onClick, children }) => (
  <Tooltip title="Change Profile Picture" placement="bottom" arrow>
    <IconButton onClick={onClick}>
      {children}
    </IconButton>
  </Tooltip>
)

const Avatar = () => {
  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(Boolean(profile?.image));

  const { profile, setProfile, profileKey } = useAppContext();

  // load the image.
  useEffect(() => {
    (async () => {
      console.log('profile', profile);
      if (profile.image) {
        const path = await getPath();

        const bucket = await Bucket.getInstance();
        const metadataBuf = await bucket.download(profileKey, path + 'metadata.json');
        const metadata = JSON.parse(new TextDecoder('utf-8').decode(metadataBuf));

        const fileBuf = await bucket.download(profileKey, path + 'pic');
        setSrc(URL.createObjectURL(new Blob(fileBuf, { type: metadata.type })));

        setLoading(false);
      }
    })();
  }, [profile.image]);

  const getPath = async () => {
    const [path] = await window.ethereum.enable();
    return `profiles/${path}/`;
  }

  const onClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      const metadata = {
        name: file.name,
        type: file.type,
        size: file.size,
        date: Date.now(),
      }

      setLoading(true);
      const path = await getPath();

      const bucket = await Bucket.getInstance();
      await bucket.upload(profileKey, path + 'pic', file);
      await bucket.upload(profileKey, path + 'metadata.json', Buffer.from(JSON.stringify(metadata)));

      // Update profile with path.
      await updateProfile({ image: path + 'pic' });
      setProfile((_profile) => ({ ..._profile, image: path + 'pic' }));
    }
    input.click();
  }

  if (!profileKey || loading) {
    return <Skeleton variant="circular" width={200} height={200} />
  }

  if (!profile?.image) {
    return (
      <Pic onClick={onClick}>
        <MUIAvatar sx={{ width: 200, height: 200 }} alt="John Doe" />
      </Pic>
    );
  }

  return <MUIAvatar sx={{ width: 200, height: 200 }} alt="John Doe" src={src} />;
}

export default Avatar;
