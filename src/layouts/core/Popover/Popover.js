import { forwardRef, useImperativeHandle, useState } from 'react';

import MUIPopover from '@mui/material/Popover';
import PropTypes from 'prop-types';

const Popover = ({ children, ...props  }, ref) => {
  const [anchorEl, setAnchorEl] = useState(null);

  useImperativeHandle(ref, () => ({
    handleOpen(e) {
      setAnchorEl(e.currentTarget);
    },

    handleClose() {
      setAnchorEl(null);
    }
  }));

  const handleClose = () => setAnchorEl(null);

  return (
    <MUIPopover
      {...props}
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      {children}
    </MUIPopover>
  )
};

Popover.propTypes = {
  children: PropTypes.node.isRequired,
};

export default forwardRef(Popover);
