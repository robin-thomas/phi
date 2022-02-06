import { useState } from 'react';

import { updateProfileImage } from '../utils/ceramic';
import Avatar from './Avatar';
import { IconButton } from '@/layouts/core/Button';
import { useAppContext } from '@/modules/common/hooks';
import Bucket from '@/modules/file/utils/bucket';
import { uploadImage } from '@/modules/file/utils/image';

const EditAvatar = () => {
  const { address, setProfile, profileKey } = useAppContext();

  const [uploading, setUploading] = useState(false);

  const onClick = async () => {
    const file = await uploadImage();

    setUploading(true);

    const uploaded = await Bucket.upload(profileKey, `${address}/pic`, file);
    updateProfileImage(address, uploaded, file).then(setProfile);
  }

  return (
    <IconButton title="Change Profile Picture" onClick={onClick}>
      <Avatar uploading={uploading} />;
    </IconButton>
  );
}

export default EditAvatar;
