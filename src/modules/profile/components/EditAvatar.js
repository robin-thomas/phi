import { useState } from 'react';

import { updateProfileImage } from '../utils/ceramic';
import Avatar from './Avatar';
import { IconButton } from '@/layouts/core/Button';
import { useAppContext } from '@/modules/common/hooks';
import { getAddress } from '@/modules/common/utils/address';
import Bucket from '@/modules/file/utils/bucket';
import { uploadImage } from '@/modules/file/utils/image';

const EditAvatar = ({}) => {
  const { setProfile, profileKey } = useAppContext();

  const [uploading, setUploading] = useState(false);

  const onClick = async () => {
    const file = await uploadImage();

    setUploading(true);

    const address = await getAddress();
    const uploaded = await Bucket.upload(profileKey, `${address}/pic`, file);

    updateProfileImage(uploaded).then(setProfile);
  }

  return (
    <IconButton title="Change Profile Picture" onClick={onClick}>
      <Avatar uploading={uploading} />;
    </IconButton>
  );
}

export default EditAvatar;
