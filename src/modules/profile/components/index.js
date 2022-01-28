import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import EditAvatar from './EditAvatar';
import EditField from './EditField';
import { IconButton } from '@/layouts/core/Button';

const Profile = ({ closeDrawer }) => (
  <>
    <Grid container sx={{ px: 1, py: 1 }} alignItems="center" spacing={2}>
      <Grid item xs="auto">
        <IconButton title="Back" onClick={closeDrawer}>
          <ChevronLeftIcon sx={{ color: '#c57e9e' }} />
        </IconButton>
      </Grid>
      <Grid item>
        <h3>Profile</h3>
      </Grid>
    </Grid>
    <Box sx={{ px: 3, py: 1 }}>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <EditAvatar />
      </Box>
      <Box sx={{ mt: 6 }}>
        <EditField label="Your Name" name="name" />
      </Box>
      <Box sx={{ mt: 10 }}>
        <EditField label="About" name="description" />
      </Box>
    </Box>
  </>
)

export { default as Avatar } from './Avatar';
export default Profile;
