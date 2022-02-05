import MUIIconButton from '@mui/material/IconButton';
import MUITooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';

const IconButton = ({ title, onClick, disabled, children }) => (
  <MUITooltip title={title} placement="top" arrow>
    <span>
      <MUIIconButton
        color="primary"
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </MUIIconButton>
    </span>
  </MUITooltip>
);

IconButton.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default IconButton;
