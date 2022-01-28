import { useRef } from 'react';

import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

import styles from './index.module.css';
import Backdrop from '@/layouts/core/Backdrop';
import { FabButton } from '@/layouts/core/Button';
import { useAppContext } from '@/modules/common/hooks';
import { /*AddContact,*/ ContactList } from '@/modules/contact/components';
import Search from '@/modules/search/components';

const Contacts = () => {
  const ref = useRef();
  const { contacts, searchResults, loadingContacts } = useAppContext();

  return (
    <>
      <Box className={styles.box}>
        <Backdrop open={loadingContacts} />
        {/* <AddContact ref={ref} /> */}
        <>
          <Box sx={{ px: 2, mt: 1 }}>
            <Search />
            <Divider sx={{ mt: contacts?.length > 0 ? 2 : 0, mb: 2 }} />
            <ContactList addressList={searchResults} />
          </Box>
          {contacts?.length === 0 && (
            <Box className="nofriendBox">
              <h2>No friends yet.</h2>
              <h4>Go ahead and add a friend!</h4>
            </Box>
          )}
        </>
      </Box>
      <Box className={styles.container}>
        <FabButton title="Add New Contact" onClick={ref.current?.openAddContact} disabled={contacts === null}>
          <AddIcon />
        </FabButton>
      </Box>
    </>
  )
};

export default Contacts;
