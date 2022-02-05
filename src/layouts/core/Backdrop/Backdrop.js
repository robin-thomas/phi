import MUIBackdrop from '@mui/material/Backdrop';
import MUICircularProgress from '@mui/material/CircularProgress';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';

const Backdrop = withStyles({
  root: {
    position: 'absolute !important',
    zIndex: 1,
  }
})(MUIBackdrop);

const BackDropLoading = ({ open }) => (
  <Backdrop open={open}>
    <MUICircularProgress color="secondary" />
  </Backdrop>
);

BackDropLoading.propTypes = {
  open: PropTypes.bool,
};

export default BackDropLoading;
