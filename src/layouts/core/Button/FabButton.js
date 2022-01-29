import MUIFab from '@mui/material/Fab';
import MUITooltip from '@mui/material/Tooltip';

const Button = ({ title, onClick, disabled, children }) => (
  <MUITooltip title={title} arrow placement="top">
    <span>
      <MUIFab onClick={onClick} disabled={disabled}>
        {children}
      </MUIFab>
    </span>
  </MUITooltip>
)

export default Button;
