import MUIButton from '@mui/material/Button';

const PillButton = ({ children }) => (
  <MUIButton
    variant="contained"
    sx={{
      background: 'black',
      color: 'white',
      fontWeight: 600,
      fontFamily: '"Orbitron", sans-serif',
      textTransform: 'capitalize',
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

export default PillButton;
