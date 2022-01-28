import { useRef } from 'react';

import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import { useMoralis } from 'react-moralis';

import { IconButton, ListItemButton } from '@/layouts/core/Button';
import { Popover } from '@/layouts/core/Popover';
import { useAppContext } from '@/modules/common/hooks';

const Settings = () => {
  const ref = useRef();
  const { setAuthenticated, setShowProfile } = useAppContext();
  const { logout, isAuthenticating } = useMoralis();

  const showProfile = () => {
    setShowProfile(true);
    ref.current?.handleClose();
  }

  const onLogout = () => {
    logout();
    setAuthenticated(false);
  }

  return (
    <>
      <Popover ref={ref}>
        <Box sx={{ minWidth: 280, bgcolor: 'background.paper' }}>
          <List subheader={<ListSubheader>Settings</ListSubheader>}>
            <ListItemButton text="Your Profile" disabled={isAuthenticating} onClick={showProfile}>
              <AccountBoxIcon />
            </ListItemButton>
            <Divider />
            <ListItemButton text="Logout" disabled={isAuthenticating} onClick={onLogout}>
              <LogoutIcon />
            </ListItemButton>
          </List>
        </Box>
      </Popover>
      <IconButton title="Settings" onClick={ref.current?.handleOpen}>
        <MoreHorizIcon fontSize="large" />
      </IconButton>
    </>
  )
}

export default Settings;
