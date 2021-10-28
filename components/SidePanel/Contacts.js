import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import { useMoralis } from 'react-moralis';

const Contacts = () => {
  const { isAuthenticated } = useMoralis();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Box sx={{ px: 4, height: 'calc(100% - 120px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2 style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 900 }}>No friends yet.</h2>
        <h4 style={{ marginTop: '-10px', color: 'rgba(255, 255, 255, 0.6)' }}>Go ahead and add a friend!</h4>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mr: 2, mt: -10 }}>
        <Tooltip title="Add New Contact" arrow placement="top">
          <Fab>
            <AddIcon />
          </Fab>
        </Tooltip>
      </Box>
    </>
  )
};

export default Contacts;
