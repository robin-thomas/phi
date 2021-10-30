import { useState } from 'react';
import { useFormik } from 'formik';
import { useMoralis } from 'react-moralis';
import * as yup from 'yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import Divider from '@mui/material/Divider';

import Contact from './Contact';
import Search from './Search';

const AddContact = ({ close }) => {
  const { user } = useMoralis();
  const [checkingContact, setCheckingContact] = useState(false);

  const formik = useFormik({
    initialValues: { address: '' },
    validationSchema: yup.object({
      address: yup
        .string()
        .matches(/^(0x){1}[0-9a-fA-F]{40}$/, 'Not valid ethereum address')
        .notOneOf([user?.attributes?.ethAddress], 'That\'s your address!')
        .required()
    }),
    onSubmit: () => setCheckingContact(true),
    enableReinitialize: true,
  });

  const onClose = () => close() && formik.resetForm();

  return (
    <>
      <Divider />
      <Card
        sx={{ pt: 4 }}
        style={{
          backgroundColor: 'transparent',
          backgroundImage: 'none',
        }}
      >
        <CardHeader
          title="Add New Contact"
          avatar={<ContactPageIcon fontSize="large" />}
          action={(
            <IconButton onClick={onClose} disabled={checkingContact}>
              <CloseIcon />
            </IconButton>
          )}
        />
        <Box sx={{ px: 2, mt: 1 }}>
          <Search
            name="address"
            placeholder="Ethereum address"
            formik={formik}
            disabled={checkingContact}
          />
          <Divider sx={{ mt: 4 }}/>
          <Contact
            address={formik.values.address}
            close={onClose}
            checkingContact={checkingContact}
            setCheckingContact={setCheckingContact}
          />
        </Box>
      </Card>
    </>
  )
}

export default AddContact;
