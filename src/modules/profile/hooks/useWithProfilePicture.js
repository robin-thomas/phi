import { useEffect, useState } from 'react';

import { useAppContext } from '@/modules/common/hooks';
import { downloadProfilePictureFromBucket } from '@/modules/file/utils/image';

const useWithProfilePicture = (profile) => {
  const[src, setSrc] = useState(null);
  const { profileKey } = useAppContext();

  // Download the profile picture (if present).
  useEffect(() => {
    if (profileKey && profile?.image) {
      downloadProfilePictureFromBucket(profileKey, profile.address, profile.image.original.mimeType)
        .then(setSrc);
    }
  }, [profile, profileKey]);

  return src;
}

export default useWithProfilePicture;
