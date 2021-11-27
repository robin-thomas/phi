import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ChatIcon from '@mui/icons-material/Chat';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';

import { useAppContext } from '../hooks';
import styles from './Header.module.css';

const Button = ({ title, disabled, onClick, children }) => (
  <Tooltip title={title} arrow placement="top">
    <span>
      <IconButton size="large" disabled={disabled} onClick={onClick}>
        {children}
      </IconButton>
    </span>
  </Tooltip>
)

const Header = () => {
  const { page, setPage, activeContact, activeContactProfile } = useAppContext();

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
        {activeContactProfile?.name && (
          <span className={styles.appName}>{activeContactProfile?.name}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;{page}</span>
        )}
      </Grid>
      {activeContact && (
        <Grid item xs="auto" sx={{ mr: 10 }}>
          <Button title="Chats" onClick={selectChat} disabled={page === 'chat'}>
            <ChatIcon />
          </Button>
          <Button title="Loans" onClick={selectLoan} disabled={page === 'loan'}>
            <RequestQuoteIcon  />
          </Button>
        </Grid>
      )}
    </Grid>
  )
}

export default Header;
