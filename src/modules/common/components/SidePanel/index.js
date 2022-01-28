import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Contacts from './Contacts';
import Header from './Header';
import styles from './index.module.css';
import { darktheme } from '@/app/styles/theme';
import { useAppContext } from '@/modules/common/hooks';
import Profile from '@/modules/profile/components';

const darkTheme = createTheme(darktheme);

const About = () => (
  <Box className="nofriendBox" sx={{ px: 5 }}>
    <h1>{process.env.APP_NAME}.</h1>
    <h3>A decentralized, secure, end-to-end encrypted chat engine built on blockchain & IPFS.</h3>
    <Divider sx={{ mb: 4 }} />
    <h4>You can send chat requests to Ethereum addresses. Once they approve, they become your friends.</h4>
    <h4>You can then share text messages and image attachments securely.</h4>
  </Box>
)

const SidePanel = () => {
  const { authenticated, showProfile, setShowProfile } = useAppContext();

  const closeDrawer = () => setShowProfile(false);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={styles.panel}>
        <Box sx={{ px: 2 }}>
          <Header />
        </Box>
        {authenticated ? <Contacts /> : <About />}
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
  );
};

export default SidePanel;