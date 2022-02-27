import { useRef } from 'react';

import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';

import { IconButton, ListItemButton } from '@/layouts/core/Button';
import { Popover } from '@/layouts/core/Popover';
import { useAppContext } from '@/modules/common/hooks';
import { logout } from '@/modules/wallet/utils/onboard';

const Settings = () => {
  const ref = useRef();
  const { profile, setShowProfile } = useAppContext();

  const showProfile = () => {
    setShowProfile(true);
    ref.current?.handleClose();
  }

  return (
    <>
      <Popover ref={ref}>
        <Box sx={{ minWidth: 280, bgcolor: 'background.paper' }}>
          <List subheader={<ListSubheader>Settings</ListSubheader>}>
            <ListItemButton text="Your Profile" disabled={!profile?.address} onClick={showProfile}>
              <AccountBoxIcon />
            </ListItemButton>
            <Divider />
            <ListItemButton text="Logout" disabled={!profile?.address} onClick={logout}>
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
