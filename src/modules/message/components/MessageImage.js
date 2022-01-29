import { useEffect, useState } from 'react';

import Skeleton from '@mui/material/Skeleton';
import Image from 'next/image';

import Bucket from '@/modules/file/utils/bucket';
import { getImageDetails, downloadImageFromBucket } from '@/modules/file/utils/image';
import { TEXTILE_BUCKET_PROFILE } from '@/modules/profile/constants/textile';

const MessageImage = ({ attachment }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const downloadImage = async () => {
      const bucketKey = await Bucket.getKey(TEXTILE_BUCKET_PROFILE);
      const url = await downloadImageFromBucket(bucketKey, attachment.location, attachment.mimeType);
      const { width, height } = await getImageDetails(url);

      return { src: url, width: 150, height: height / (width / 150) };
    }

    downloadImage(setImage);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!image) {
    return <Skeleton variant="rectangular" width={150} height={250} />;
  }

  return <Image src={image.src} alt="" width={image.width} height={image.height} />;
}

export default MessageImage;
