import Grid from '@mui/material/Grid';
import MUIButton from '@mui/material/Button';

import SidePanel from '../components/SidePanel';
import ChatPanel from '../components/ChatPanel';

import { useAppContext } from '../components/hooks';

const Button = ({ children }) => (
  <MUIButton
    variant="contained"
    sx={{
      background: 'black',
      color: 'white',
      fontWeight: 600,
      borderColor: 'black',
      borderRadius: 25,
      cursor: 'none',
      '&:hover': {
        background: 'black',
      }
    }}
  >
    {children}
  </MUIButton>
)

function Index() {
  const { network } = useAppContext();

  return (
    <>
      <Grid container sx={{ pt: 2, px: 3 }} justifyContent="space-between">
        <Grid item>
          <Button>{process.env.APP_NAME}</Button>
        </Grid>
        {network && (
          <Grid item>
            <Button>{network}</Button>
          </Grid>
        )}
      </Grid>
      <SidePanel />
      <ChatPanel />
    </>
  )
}

export default Index;
