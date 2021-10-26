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
import { useMoralis } from 'react-moralis';

import styles from './Settings.module.css';

const Settings = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const { logout, isAuthenticating } = useMoralis();

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Grid container sx={{ px: 3, py: 3 }} justifyContent="flex-end">
        <Grid item>
          <Tooltip title="Settings" arrow placement="top">
            <IconButton onClick={handleClick}>
              <MoreHorizIcon fontSize="large" className={styles.button}/>
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
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
