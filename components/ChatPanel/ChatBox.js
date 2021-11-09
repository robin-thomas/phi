import { useState } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Utils from '../../utils';
import Thread from '../../utils/textile/thread';
import { useAppContext } from '../hooks';

const Button = ({ title, disabled, onClick, children }) => (
  <Tooltip title={title} placement="top" arrow>
    <IconButton color="secondary" disabled={disabled} {...onClick ? {onClick}: {}}>
      {children}
    </IconButton>
  </Tooltip>
)

const whiteTheme = createTheme({
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
});

const ChatBox = ({ threadID }) => {
  const [files, setFiles] = useState([]);
  const { activeContact } = useAppContext();

  const attachFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      const file = e.target.files[0];
      setFiles(_files => ({..._files, [file.name]: file }));
    }
    input.click();
  };

  const removeFile = (name) => () => {
    setFiles(_files => {
      delete _files[name];
      return {..._files};
    });
  }

  const formik = useFormik({
    initialValues: { message: '' },
    validationSchema: yup.object({ message: yup.string() }),
    onSubmit: async (values, { resetForm }) => {
      if (values.message) {
        const thread = await Utils.getInstance(Thread);
        await thread.chat(threadID).post(activeContact, values.message);
        resetForm();
      }
    },
    enableReinitialize: true,
  });

  return (
    <ThemeProvider theme={whiteTheme}>
      <Grid container>
        {Object.keys(files).map(name => (
          <Grid xs={4} key={name}>
            <Alert
              icon={<></>}
              severity="info"
              sx={{ mr: 2 }}
              action={(
                <IconButton color="inherit" onClick={removeFile(name)}>
                  <CloseIcon fontSize="small"/>
                </IconButton>
              )}
            >
              {name.length > 30 ? `${name.substr(0, 10)}...${name.substr(name.length - 20)}` : name}
            </Alert>
          </Grid>
        ))}
      </Grid>
      <TextField
        name="message"
        value={formik.values.message}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        onKeyDown={(e) => e.key === 'Enter' && formik.handleSubmit()}
        placeholder="Type a message"
        autoComplete='off'
        variant="filled"
        fullWidth
        sx={{ mt: 1 }}
        InputProps={{
          disableUnderline: true,
          endAdornment: (
            <InputAdornment position="end">
              <>
                <Button
                  title="Attach file"
                  onClick={attachFile}
                  disabled={Object.keys(files).length === 3}
                >
                  <AttachFileIcon fontSize="small" />
                </Button>
                <Button
                  title="Send message"
                  onClick={formik.handleSubmit}
                  disabled={!formik.values.message || formik.values.message?.length === 0}
                >
                  <SendIcon fontSize="small" />
                </Button>
              </>
            </InputAdornment>
          ),
        }}
      />
    </ThemeProvider>
  )
};

export default ChatBox;
