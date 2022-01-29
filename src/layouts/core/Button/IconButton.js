import MUIIconButton from '@mui/material/IconButton';
import MUITooltip from '@mui/material/Tooltip';

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

export default IconButton;
