import { withStyles } from '@mui/styles';
import MUIBackdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const Backdrop = withStyles({
  root: {
    position: 'absolute !important',
    zIndex: 1,
  }
})(MUIBackdrop);

const BackDropLoading = ({ open }) => (
  <Backdrop open={open}>
    <CircularProgress color="secondary" />
  </Backdrop>
);

export default BackDropLoading;
