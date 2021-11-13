import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import LinearProgress from '@mui/material/LinearProgress';

import Utils from '../../utils';
import Ceramic from '../../utils/ceramic';
import Bucket from '../../utils/textile/bucket';

const File = ({ file, address, setAttachments, removeFile }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    (async () => {
      // read the file as binary.
      const ab = await readFile();

      // encrypt the file using ceramic.
      const ceramic = await Utils.getInstance(Ceramic);
      const hex = await ceramic.file().encrypt(ab, address);

      // upload to textile
      const bucket = await Utils.getInstance(Bucket);
      const path = `${address}/files/${file.name}`;
      const bucketKey = await bucket.getKey(process.env.TEXTILE_BUCKET_PROFILE);
      const _file = { path, content: Buffer.from(hex) };
      await bucket.upload(bucketKey, path, _file, {
        progress: (number) => setProgress(100 * number / hex.length),
      });

      setAttachments(attachments => ([
        ...attachments,
        {
          name: file.name,
          location: path,
          mimeType: file.mimeType,
          size: file.size
        },
      ]));
    })();
  }, []);

  const readFile = () => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsArrayBuffer(file);
    });
  }

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

export default File;
