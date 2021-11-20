export const whitetheme = {
  components: {
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          paddingTop: '0px',
          fontSize: '14px',
          background: 'white',
          '&:hover': {
            background: 'white',
          },
        },
        input: {
          paddingTop: '20px',
          paddingBottom: '15px',
          paddingLeft: '20px',
          fontSize: '14px',
          color: 'black',
          fontWeight: 900,
        },
      },
    },
  },
};

export const darktheme = {
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
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          paddingTop: '0px',
          fontSize: '16px',
        },
        input: {
          paddingTop: '10px',
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          marginTop: '5px !important',
        },
      },
    },
  },
};
