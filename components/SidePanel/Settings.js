import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemIcon from '@mui/material/ListItemIcon';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useMoralis } from 'react-moralis';
import Divider from '@mui/material/Divider';

import { useAppContext } from '../hooks';

const Settings = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const { setShowProfile } = useAppContext();
  const { logout, isAuthenticating } = useMoralis();

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const showProfile = () => {
    setShowProfile(true);
    handleClose();
  }

  return (
    <>
      <Tooltip title="Settings" arrow placement="top">
        <IconButton onClick={handleClick}>
          <MoreHorizIcon fontSize="large"/>
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ minWidth: 280, bgcolor: 'background.paper' }}>
          <List subheader={<ListSubheader>Settings</ListSubheader>}>
            <ListItem disablePadding>
              <ListItemButton disabled={isAuthenticating} onClick={showProfile}>
                <ListItemIcon>
                  <AccountBoxIcon />
                </ListItemIcon>
                <ListItemText primary="Your Profile" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <ListItemButton disabled={isAuthenticating} onClick={logout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Popover>
    </>
  )
}

export default Settings;
