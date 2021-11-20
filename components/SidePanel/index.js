import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Header from './Header';
import Profile from '../Profile';
import Contacts from './Contacts';

import styles from './index.module.css';
import { useAppContext } from '../hooks';
import { darktheme } from '../../globals/theme';

const darkTheme = createTheme(darktheme);

const SidePanel = () => {
  const { showProfile, setShowProfile } = useAppContext();

  const closeDrawer = () => setShowProfile(false);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={styles.panel}>
        <Box sx={{ px: 2 }}>
          <Header />
        </Box>
        <Contacts />
        <Drawer
          anchor="left"
          open={showProfile}
          onClose={closeDrawer}
          classes={{ paper: styles.drawer }}
          SlideProps={{ timeout: 300 }}
        >
          <Profile closeDrawer={closeDrawer} />
        </Drawer>
      </div>
    </ThemeProvider>
  )
};

export default SidePanel;
