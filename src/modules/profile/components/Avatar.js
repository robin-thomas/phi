import { useEffect, useState } from 'react';

import propTypes from 'prop-types';

import { Avatar as BaseAvatar } from '@/layouts/core/Avatar';
import { useAppContext } from '@/modules/common/hooks';
import { downloadProfilePicture } from '@/modules/file/utils/image';

const Avatar = ({ profile, mini, uploading }) => {
  const { profileKey, profile: selfProfile } = useAppContext();

  const [user, setUser] = useState(profile === null ? null : profile || selfProfile);
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState(null);

  // load the profile picture.
  useEffect(() => {
    let mounted = true;

    const downloadImage = async () => {
      setLoading(true);
      const _profilePic = await downloadProfilePicture(profileKey, user.address, user.image.original.mimeType);

      if (mounted) {
        setProfilePic(_profilePic);
        setLoading(false);
      }
    }

    if (user?.image && profileKey) {
      downloadImage();
    }

    return () => {
      mounted = false;
    }
  }, [user?.image, user?.address, profileKey]);

  useEffect(() => uploading && setLoading(true), [uploading]);

  // trigger an update if self profile pic is updated.
  useEffect(() => {
    if (!profile && selfProfile.image) {
      setUser(selfProfile);
    }
  }, [selfProfile.image]); // eslint-disable-line react-hooks/exhaustive-deps

  return <BaseAvatar src={profilePic} mini={mini} skeleton={loading} />;
}

Avatar.propTypes = {
  profile: propTypes.object,
  mini: propTypes.bool,
  uploading: propTypes.bool,
};

export default Avatar;
