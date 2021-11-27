import { useState } from 'react';
import { useFormik } from 'formik';
import { useMoralis } from 'react-moralis';
import * as yup from 'yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
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
        .required('We need this!')
    }),
    onSubmit: () => setCheckingContact(true),
    enableReinitialize: true,
  });

  const onClose = () => close() && formik.resetForm();

  return (
    <>
      <Divider sx={{ mb: 2 }}/>
      <Card
        sx={{ pb: 2 }}
        style={{
          backgroundColor: 'rgba(0,0,0,0.8)',
          backgroundImage: 'none',
          borderRadius: '10px',
        }}
      >
        <CardHeader
          title={<h6 style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>Add New Contact</h6>}
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
          <Divider sx={{ my: 2 }}/>
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
