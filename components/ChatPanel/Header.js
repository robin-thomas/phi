import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ChatIcon from '@mui/icons-material/Chat';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';

import Utils from '../../utils';
import Ceramic from '../../utils/ceramic';
import { useAppContext } from '../hooks';
import styles from './Header.module.css';

const Button = ({ title, disabled, onClick, children }) => (
  <Tooltip title={title} arrow placement="top">
    <span>
      <IconButton color="secondary" disabled={disabled} onClick={onClick}>
        {children}
      </IconButton>
    </span>
  </Tooltip>
)

const Header = () => {
  const { page, setPage, activeContact } = useAppContext();
  const [name, setName] = useState('');

  useEffect(() => {
    if (activeContact) {
      (async () => {
        const ceramic = await Utils.getInstance(Ceramic);
        const profile = await ceramic.getProfile(activeContact);
        setName(profile?.name);
      })();
    } else {
      setName('');
    }
  }, [activeContact]);

  const selectChat = () => setPage('chat');
  const selectLoan = () => setPage('loan');

  return (
    <Grid
      container
      spacing={3}
      alignItems='center'
      className={styles.header}
      justifyContent="space-between"
    >
      <Grid item xs="auto" sx={{ ml: 18 }}>
        <span className={styles.appName}>{name}</span>
      </Grid>
      {activeContact && (
        <Grid item xs="auto" sx={{ mr: 10 }}>
          <Button title="Chat" onClick={selectChat} disabled={page === 'chat'}>
            <ChatIcon fontSize="large" />
          </Button>
          <Button title="Loan" onClick={selectLoan} disabled={page === 'loan'}>
            <RequestQuoteIcon fontSize="large" />
          </Button>
        </Grid>
      )}
    </Grid>
  )
}

export default Header;
