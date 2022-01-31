import { useEffect, useRef, useState } from 'react';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SendIcon from '@mui/icons-material/Send';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { attachmentsDefaults } from '../constants/attachments';
import Emoji from './Emoji';
import { whitetheme } from '@/app/styles/theme';
import { IconButton } from '@/layouts/core/Button';
import { Popover } from '@/layouts/core/Popover';
import { TextField } from '@/layouts/core/TextField';
import { useAppContext } from '@/modules/common/hooks';
import Attachment from '@/modules/file/components/Attachment';
import { uploadImage } from '@/modules/file/utils/image';
import Chat from '@/modules/message/utils/textile/chat';

const whiteTheme = createTheme(whitetheme);

const ChatBox = ({ threadID }) => {
  const ref = useRef();
  const { activeContact } = useAppContext();

  const [files, setFiles] = useState({});
  const [emoji, setEmoji] = useState(false);
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    if (emoji?.emoji) {
      formik.setFieldValue('message', `${formik.values.message}${emoji.emoji}`);
    }
  }, [formik, emoji]);

  const attachFile = async () => {
    const file = await uploadImage();
    setFiles(_files => ({ ..._files, [file.name]: file }));
  };

  const removeFile = (name) => () => setFiles(_files => _files.filter(file => file !== name));

  const formik = useFormik({
    initialValues: { message: '' },
    validationSchema: yup.object({ message: yup.string() }),
    onSubmit: async (values, { resetForm }) => {
      if (values.message || attachments.length > 0) {
        Chat.setThreadId(threadID);
        Chat.post(activeContact, values.message, attachments);

        resetForm();
        setFiles([]);
        setAttachments([]);
      }
    },
    enableReinitialize: true,
  });

  return (
    <ThemeProvider theme={whiteTheme}>
      <Grid container>
        {Object.keys(files).map(name => (
          <Grid item xs={4} key={name}>
            <Attachment
              file={files[name]}
              address={activeContact}
              removeFile={removeFile}
              setAttachments={setAttachments}
            />
          </Grid>
        ))}
      </Grid>
      <Popover ref={ref} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Emoji setEmoji={setEmoji} />
      </Popover>
      <TextField
        formik={formik}
        name="message"
        placeholder="Type a message"
        onKeyDown={(e) => e.key === 'Enter' && formik.handleSubmit()}
        sx={{ mt: 1 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <>
                <IconButton
                  title="Add emojis"
                  onClick={ref.current?.handleOpen}
                  disabled={Object.keys(files).length === attachmentsDefaults.maxFiles}
                >
                  <InsertEmoticonIcon fontSize="small" />
                </IconButton>
                <IconButton
                  title="Attach file"
                  onClick={attachFile}
                  disabled={Object.keys(files).length === attachmentsDefaults.maxFiles}
                >
                  <AttachFileIcon fontSize="small" />
                </IconButton>
                <IconButton
                  title="Send message"
                  onClick={formik.handleSubmit}
                  disabled={attachments.length == 0 && (!formik.values.message || formik.values.message?.length === 0)}
                >
                  <SendIcon fontSize="small" />
                </IconButton>
              </>
            </InputAdornment>
          ),
        }}
      />
    </ThemeProvider>
  )
};

export default ChatBox;
