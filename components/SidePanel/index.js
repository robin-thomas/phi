import Drawer from '@mui/material/Drawer';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Header from './Header';
import Profile from '../Profile';
import Contacts from './Contacts';

import styles from './index.module.css';
import { useAppContext } from '../hooks';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    text: {
      disabled: 'white',
    },
  },
  components: {
    MuiFab: {
      styleOverrides: {
        root: {
          background: '#c57e7e',
          transition: '0.3s all',
          '&:hover': {
            background: '#c57e9e',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#c57e9e',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#d47256',
          fontWeight: 900,
          marginTop: '-20px !important',
        },
      },
    },
  },
});

const SidePanel = () => {
  const { showProfile, setShowProfile } = useAppContext();

  const closeDrawer = () => setShowProfile(false);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={styles.panel}>
        <Header />
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
