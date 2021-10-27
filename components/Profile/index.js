import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import Name from './Name';

import styles from './index.module.css';

const Profile = ({ closeDrawer }) => (
  <>
    <Grid container sx={{ px: 1, py: 1 }} alignItems="center" spacing={2} className={styles.drawerHeader}>
      <Grid item xs="auto">
        <Tooltip title="Back" placement="top" arrow>
          <IconButton onClick={closeDrawer}>
            <ChevronLeftIcon sx={{ color: '#c57e9e' }} />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item>
        <h3>Profile</h3>
      </Grid>
    </Grid>
    <Box sx={{ px: 3, py: 1 }}>
      <Box sx={{ mt: 6 }}>
        <Name />
      </Box>
    </Box>
  </>
)

export default Profile;
