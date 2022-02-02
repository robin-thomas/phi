import MUIAvatar from '@mui/material/Avatar';
import MUISkeleton from '@mui/material/Skeleton';

const Avatar = ({ mini, src, skeleton }) => {
  const width = mini ? 50 : 200;
  const height = mini ? 50 : 200;

  if (skeleton) {
    return (
      <MUISkeleton variant="circular" width={width} height={height} />
    )
  }

  return (
    <MUIAvatar sx={{ width, height }} src={src} />
  );
}

export default Avatar;
