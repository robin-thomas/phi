import MUIAvatar from '@mui/material/Avatar';
import MUISkeleton from '@mui/material/Skeleton';
import PropTypes from 'prop-types';

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

Avatar.propTypes = {
  mini: PropTypes.bool,
  src: PropTypes.string,
  skeleton: PropTypes.bool,
};

export default Avatar;
