import { forwardRef, useImperativeHandle, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { useFormik } from 'formik';
import { useMoralis } from 'react-moralis';
import * as yup from 'yup';

import { Contact } from './Contact';
import { SearchInput } from '@/modules/search/components';

const AddContact = (props, ref) => {
  const { user } = useMoralis();

  const [open, setOpen] = useState(false);
  const [checkingContact, setCheckingContact] = useState(false);

  useImperativeHandle(ref, () => ({
    isOpen: () => open,
    openAddContact: () => setOpen(true),
    closeAddContact: () => setOpen(false),
  }));

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

  const onClose = () => setOpen(false) && formik.resetForm();

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
          <SearchInput
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
  );
}

export default forwardRef(AddContact);
