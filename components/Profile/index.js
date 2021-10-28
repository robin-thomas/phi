import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import Edit from './Edit';
import Avatar from './Avatar';

const Profile = ({ closeDrawer }) => (
  <>
    <Grid container sx={{ px: 1, py: 1 }} alignItems="center" spacing={2}>
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
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Avatar />
      </Box>
      <Box sx={{ mt: 6 }}>
        <Edit label="Your Name" name="name" />
      </Box>
      <Box sx={{ mt: 10 }}>
        <Edit label="About" name="description" />
      </Box>
    </Box>
  </>
)

export default Profile;
