import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
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
          <IconButton onClick={handleClick}>
            <MoreHorizIcon fontSize="large" className={styles.button}/>
          </IconButton>
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
        <Box sx={{ minWidth: 300, bgcolor: 'background.paper' }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton disabled={isAuthenticating} onClick={logout}>
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
