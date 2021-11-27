import { useState } from 'react';
import { useMoralis } from 'react-moralis';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';

import About from './About';
import AddContact from './AddContact';
import Backdrop from '../Backdrop';
import SearchContact from './SearchContact';

import { useAppContext } from '../hooks';
import styles from './Contacts.module.css';

const Contacts = () => {
  const { isAuthenticated } = useMoralis();
  const { contacts, profileKey, loadingContacts } = useAppContext();

  const [addContact, setAddContact] = useState(false);

  if (!isAuthenticated) {
    return <About />;
  }

  return (
    <>
      <Box className={styles.box}>
        <Backdrop open={loadingContacts} />
        {addContact ? <AddContact close={() => setAddContact(false)} /> : (
          <>
            <Box sx={{ px: 2, mt: 1 }}>
              <SearchContact />
            </Box>
            {contacts?.length === 0 && (
              <>
                <Box className={styles.nofriendBox}>
                  <h2>No friends yet.</h2>
                  <h4>Go ahead and add a friend!</h4>
                </Box>
              </>
            )}
          </>
        )}
      </Box>
      <Box className={styles.addfriendBox}>
        <Tooltip title="Add New Contact" arrow placement="top">
          <span>
            <Fab onClick={() => setAddContact(true)} disabled={!profileKey}>
              <AddIcon />
            </Fab>
            </span>
        </Tooltip>
      </Box>
    </>
  )
};

export default Contacts;
