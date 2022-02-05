import MUIFab from '@mui/material/Fab';
import MUITooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';

const Button = ({ title, onClick, disabled, children }) => (
  <MUITooltip title={title} arrow placement="top">
    <span>
      <MUIFab onClick={onClick} disabled={disabled}>
        {children}
      </MUIFab>
    </span>
  </MUITooltip>
)

Button.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

export default Button;
