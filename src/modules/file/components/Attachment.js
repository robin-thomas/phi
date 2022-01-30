import { useEffect, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';

import Bucket from '../utils/bucket';
import { encrypt } from '../utils/ceramic';
import { readImage } from '../utils/image';
import { TEXTILE_BUCKET_PROFILE } from '@/modules/profile/constants/textile';

const Attachment = ({ file, address, setAttachments, removeFile }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = (hex) => (number) => setProgress(100 * number / hex.length);

    const uploadToBucket = async (path) => {
      // read the file as binary, and encrypt using ceramic.
      const ab = await readImage(file);
      const hex = await encrypt(ab, address);

      const bucketKey = await Bucket.getKey(TEXTILE_BUCKET_PROFILE);

      // upload to textile
      const bucket = { path, content: Buffer.from(hex) };
      await Bucket.upload(bucketKey, path, bucket, { progress: updateProgress(hex) });
    }

    const path = `${address}/files/${file.name}`;
    uploadToBucket(path)
      .then(() => setAttachments(_files => ([..._files, { ...file, location: path }])));
  }, []);

  return (
    <Alert
      icon={<></>}
      severity="info"
      sx={{ mr: 2 }}
      action={progress === 100 && (
        <IconButton color="inherit" onClick={removeFile(file.name)}>
          <CloseIcon fontSize="small"/>
        </IconButton>
      )}
    >
      <Grid container>
        <Grid item xs={12}>
          {file.name.length > 30 ? `${file.name.substr(0, 10)}...${file.name.substr(name.length - 20)}` : file.name}
        </Grid>
        {progress < 100 && (
          <Grid item xs={12}>
            <LinearProgress variant="determinate" value={progress} />
          </Grid>
        )}
      </Grid>
    </Alert>
  )
}

export default Attachment;
