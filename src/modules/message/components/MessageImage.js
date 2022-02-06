import { useEffect, useState } from 'react';

import Skeleton from '@mui/material/Skeleton';
import Image from 'next/image';
import propTypes from 'prop-types';

import { useAppContext } from '@/modules/common/hooks';
import Bucket from '@/modules/file/utils/bucket';
import { decrypt } from '@/modules/file/utils/ceramic';
import { getImageDetails, downloadImageFromBucket } from '@/modules/file/utils/image';
import { TEXTILE_BUCKET_PROFILE } from '@/modules/profile/constants/textile';

const MessageImage = ({ attachment }) => {
  const { address } = useAppContext();

  const [image, setImage] = useState(null);

  useEffect(() => {
    const downloadImage = async () => {
      const bucketKey = await Bucket.getKey(TEXTILE_BUCKET_PROFILE);
      const { location, mimeType } = attachment;
      const url = await downloadImageFromBucket(bucketKey, location, mimeType, async (buf) => {
        const hex = Buffer.from(buf).toString();
        return await decrypt(hex, address);
      });
      const { width, height } = await getImageDetails(url);

      return { src: url, width: 150, height: height / (width / 150) };
    }

    downloadImage().then(setImage);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!image) {
    return <Skeleton variant="rectangular" width={150} height={250} />;
  }

  return <Image src={image.src} alt="" width={image.width} height={image.height} />;
}

MessageImage.propTypes = {
  attachment: propTypes.object.isRequired,
};

export default MessageImage;
