import MUIListItem from '@mui/material/ListItem';
import MUIListItemButton from '@mui/material/ListItemButton';
import MUIListItemIcon from '@mui/material/ListItemIcon';
import MUIListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';

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

ListItemButton.propTypes = {
  text: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export default ListItemButton;
