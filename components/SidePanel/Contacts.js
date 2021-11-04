import { useState } from 'react';
import { useMoralis } from 'react-moralis';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import Divider from '@mui/material/Divider';
import MUIBackdrop from '@mui/material/Backdrop';
import { withStyles } from '@mui/styles';
import CircularProgress from '@mui/material/CircularProgress';

import AddContact from './AddContact';
import SearchContact from './SearchContact';

import { useAppContext } from '../hooks';
import 'simplebar/dist/simplebar.min.css';

const Backdrop = withStyles({
  root: {
    position: 'absolute !important',
    zIndex: 1
  }
})(MUIBackdrop);

const Contacts = () => {
  const { isAuthenticated } = useMoralis();
  const { contacts, profileKey, loadingContacts } = useAppContext();

  const [addContact, setAddContact] = useState(false);

  if (!isAuthenticated || !profileKey) {
    return null;
  }

  return (
    <>
      <Box sx={{ px: 2, height: 'calc(100% - 120px)' }}>
        <Backdrop open={loadingContacts}>
          <CircularProgress color="secondary" />
        </Backdrop>
        {addContact ? <AddContact close={() => setAddContact(false)} /> : (
          <>
            {contacts?.length > 0 ? (
              <Box sx={{ px: 2, mt: 1 }}>
                <SearchContact />
              </Box>
            ) : (
              <>
                <Divider />
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h2 style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 900 }}>No friends yet.</h2>
                  <h4 style={{ marginTop: '-10px', color: 'rgba(255, 255, 255, 0.6)' }}>Go ahead and add a friend!</h4>
                </Box>
              </>
            )}
          </>
        )}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mr: 2, mt: -10 }}>
        <Tooltip title="Add New Contact" arrow placement="top">
          <Fab onClick={() => setAddContact(true)}>
            <AddIcon />
          </Fab>
        </Tooltip>
      </Box>
    </>
  )
};

export default Contacts;
