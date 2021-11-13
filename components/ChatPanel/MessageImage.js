import { useEffect, useState } from 'react';
import Image from 'next/image';
import Skeleton from '@mui/material/Skeleton';

import Utils from '../../utils';
import Ceramic from '../../utils/ceramic';
import Bucket from '../../utils/textile/bucket';

const MessageImage = ({ attachment }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      const bucket = await Utils.getInstance(Bucket);
      const bucketKey = await bucket.getKey(process.env.TEXTILE_BUCKET_PROFILE);
      const buf = await bucket.download(bucketKey, attachment.location);

      const ceramic = await Utils.getInstance(Ceramic);
      const hex = Buffer.from(buf).toString();
      const ab = await ceramic.file().decrypt(hex);

      const url = URL.createObjectURL(new Blob([ab], { type: attachment.mimeType }));
      const { width, height } = await getImageDetails(url);
      setImage({
        src: url,
        width: 150,
        height: height / (width / 150),
      });
    })();
  }, []);

  const getImageDetails = (url) => {
    return new Promise(resolve => {
      const img = new window.Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.src = url;
    });
  }

  return image ? (
    <Image src={image.src} alt="" width={image.width} height={image.height} />
  ) : <Skeleton variant="rectangular" width={150} height={250} />;
}

export default MessageImage;
