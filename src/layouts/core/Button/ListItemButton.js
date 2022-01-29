import MUIListItem from '@mui/material/ListItem';
import MUIListItemButton from '@mui/material/ListItemButton';
import MUIListItemIcon from '@mui/material/ListItemIcon';
import MUIListItemText from '@mui/material/ListItemText';

const ListItemButton = ({ text, disabled, onClick, children }) => (
  <MUIListItem disablePadding>
    <MUIListItemButton disabled={disabled} onClick={onClick}>
      <MUIListItemIcon>
        {children}
      </MUIListItemIcon>
      <MUIListItemText primary={text} />
    </MUIListItemButton>
  </MUIListItem>
);

export default ListItemButton;
