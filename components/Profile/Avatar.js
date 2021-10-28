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
);

const Avatar = ({ mini }) => {
  const [loading, setLoading] = useState(Boolean(profile?.image));
  const { profile, profilePic, setProfile, profileKey } = useAppContext();

  useEffect(() => profilePic && setLoading(false), [profilePic]);

  const getPath = async () => {
    const [path] = await window.ethereum.enable();
    return `${path}/`;
  }

  const onClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];

      setLoading(true);

      const path = await getPath();
      const bucket = await Bucket.getInstance();
      const uploaded = await bucket.upload(profileKey, path + 'pic', file);
      console.debug('Uploaded profile picture to textile bucket');

      const image = {
        original: {
          src: `ipfs://${uploaded.path.path.replace('/ipfs/', '')}`,
          mimeType: file.type,
          width: 200,
          height: 200,
        },
      };

      const _profile = { ...profile, image };
      await updateProfile(_profile);
      setProfile(_profile);
    }
    input.click();
  }

  if (!profilePic || loading) {
    if (mini) {
      return <Skeleton variant="circular" width={50} height={50} />
    }
    return <Skeleton variant="circular" width={200} height={200} />
  }

  if (mini) {
    return <MUIAvatar sx={{ width: 50, height: 50 }} alt="John Doe" src={profilePic} />
  }

  return (
    <Pic onClick={onClick}>
      <MUIAvatar sx={{ width: 200, height: 200 }} alt="John Doe" src={profilePic} />
    </Pic>
  );
}

export default Avatar;
