import Grid from '@mui/material/Grid';
import MUISkeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

const ChatSkeletonLeft = () => (
  <Grid container>
    <Grid item xs={1}>
      <MUISkeleton variant="circular" width={50} height={50} />
    </Grid>
    <Grid item xs={11}>
      <MUISkeleton animation="wave" ariant="rectangular" width={400} height={60} />
    </Grid>
    <Grid item xs={1} />
    <Grid item xs={3}>
      <MUISkeleton animation="wave" variant="text" />
    </Grid>
  </Grid>
)

const ChatSkeletonRight = () => (
  <Grid container justifyContent="flex-end">
    <Grid container item xs={11} justifyContent="flex-end">
      <MUISkeleton animation="wave" variant="rectangular" width={400} height={60} />
    </Grid>
    <Grid container item xs={1} justifyContent="flex-end">
      <MUISkeleton variant="circular" width={50} height={50} />
    </Grid>
    <Grid item xs={3}>
      <MUISkeleton animation="wave" variant="text" />
    </Grid>
    <Grid item xs={1} />
  </Grid>
)

const Skeleton = () => (
  <Stack spacing={4}>
    <ChatSkeletonLeft />
    <ChatSkeletonRight />
    <ChatSkeletonLeft />
  </Stack>
)

export default Skeleton;
