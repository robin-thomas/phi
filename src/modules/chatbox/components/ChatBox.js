import { useEffect, useRef, useState } from 'react';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SendIcon from '@mui/icons-material/Send';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useFormik } from 'formik';
import { checkText } from 'smile2emoji';
import * as yup from 'yup';

import { attachmentsDefaults } from '../constants/attachments';
import Chat from '../utils/textile';
import Emoji from './Emoji';
import { whitetheme } from '@/app/styles/theme';
import { IconButton } from '@/layouts/core/Button';
import { Popover } from '@/layouts/core/Popover';
import { TextField } from '@/layouts/core/TextField';
import { useAppContext } from '@/modules/common/hooks';
import Attachment from '@/modules/file/components/Attachment';
import { uploadImage } from '@/modules/file/utils/image';
import Ack from '@/modules/friendrequest/utils/textile/ack';

const whiteTheme = createTheme(whitetheme);

const ChatBox = () => {
  const ref = useRef();
  const { profile, threadIDs, activeContact, setUnreadCount } = useAppContext();

  const [files, setFiles] = useState({});
  const [emoji, setEmoji] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const formik = useFormik({
    initialValues: { message: '' },
    validationSchema: yup.object({ message: yup.string() }),
    onSubmit: (values, { resetForm }) => {
      if (values.message || attachments.length > 0) {
        const from = profile.address;
        const to = activeContact;

        Chat.post(threadIDs[activeContact], { from, to, message: values.message, attachments });
        Ack.update(from, to);

        resetForm();
        setEmoji(null);
        setFiles([]);
        setAttachments([]);
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => setUnreadCount(count => ({ ...count, [activeContact]: 0 })), [activeContact, setUnreadCount]);

  useEffect(() => {
    if (emoji?.emoji) {
      formik.setFieldValue('message', `${formik.values.message}${emoji.emoji}`);
    }
  }, [emoji]); // eslint-disable-line

  const onMessageUpdate = () => {
    const message = checkText(formik.values.message);

    if (message !== formik.values.message) {
      formik.setFieldValue('message', message);
    }
  }

  const attachFile = async () => {
    const file = await uploadImage();
    setFiles(_files => ({ ..._files, [file.name]: file }));
  };

  const removeFile = (name) => () => setFiles(_files => _files.filter(file => file !== name));

  const disableButton = (btnName) => {
    if (formik.isSubmitting) {
      return true;
    }

    switch (btnName) {
      case 'attachFile':
        return Object.keys(files).length === attachmentsDefaults.maxFiles;

      case 'sendMessage':
        return attachments.length == 0 && (!formik.values.message || formik.values.message?.length === 0);
    }

    return false;
  }

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
      <Popover ref={ref} transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Emoji setEmoji={setEmoji} />
      </Popover>
      <TextField
        formik={formik}
        name="message"
        placeholder="Type a message"
        disabled={formik.isSubmitting}
        onChange={onMessageUpdate}
        onKeyDown={(e) => e.key === 'Enter' && formik.handleSubmit()}
        sx={{ mt: 1 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <>
                <IconButton
                  title="Add emojis"
                  onClick={ref.current?.handleOpen}
                  disabled={disableButton('addEmoji')}
                >
                  <InsertEmoticonIcon fontSize="small" />
                </IconButton>
                <IconButton
                  title="Attach file"
                  onClick={attachFile}
                  disabled={disableButton('attachFile')}
                >
                  <AttachFileIcon fontSize="small" />
                </IconButton>
                <IconButton
                  title="Send message"
                  onClick={formik.handleSubmit}
                  disabled={disableButton('sendMessage')}
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
