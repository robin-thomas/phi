import { forwardRef, useImperativeHandle, useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import { useFormik } from 'formik';
import * as yup from 'yup';

import Contact from './Contact';
import { useAppContext } from '@/modules/common/hooks';
import { Invite } from '@/modules/friendrequest/utils';
import { getProfile } from '@/modules/profile/utils/ceramic';
import { SearchInput } from '@/modules/search/components';

const AddContact = (_, ref) => {
  const { address } = useAppContext();

  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [checkingContact, setCheckingContact] = useState(false);

  useImperativeHandle(ref, () => ({
    openAddContact: () => setOpen(true),
  }));

  const formik = useFormik({
    initialValues: { address: '' },
    validationSchema: yup.object({
      address: yup
        .string()
        .lowercase()
    }),
    validate: (values) => {
      const errors = {};

      if (!values.address) {
        errors.address = 'We need this to search!';
      } else if (!/^(0x){1}[0-9a-fA-F]{40}$/.test(values.address)) {
        errors.address = 'Not valid ethereum address';
      } else if ([address].includes(values.address)) {
        errors.address = 'That\'s your address!';
      }

      if (errors.address) {
        setProfile(null);
      }

      return errors;
    },
    onSubmit: async (values) => {
      if (values.address) {
        setCheckingContact(true);

        const _profile = await getProfile(values.address);
        if (_profile) {
          setProfile(_profile);
        }

        setCheckingContact(false);
      } else {
        setProfile(null);
      }
    },
    enableReinitialize: true,
  });

  const onClose = () => {
    setOpen(false);
    formik.resetForm();
    setProfile(null);
  }

  const addNewContact = async () => {
    setSendingInvite(true);

    try {
      await Invite.post(profile.address);

      onClose();
    } catch (err) {
      formik.setErrors({ address: err.message });
    }

    setSendingInvite(false);
  }

  return (
    <Dialog
      open={open}
      disableBackdropClick
      disableEscapeKeyDown
    >
      <DialogTitle>Add New Contact</DialogTitle>
      <DialogContent>
        <SearchInput
          name="address"
          placeholder="Ethereum address"
          formik={formik}
          disabled={sendingInvite || checkingContact}
        />
        <DialogContentText sx={{ mt: 2, mb: 2 }}>
          You can send a friend request if you know their Ethereum address. Once they approve the request, you can start messaging them.
        </DialogContentText>
        {profile && (
          <>
            <Divider sx={{ my: 2 }} />
            <Contact profile={profile} action={<></>} />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <>
          {profile && <Button disabled={sendingInvite} onClick={addNewContact} color="success">Send Invite</Button>}
          <Button disabled={sendingInvite} onClick={onClose} color="info">Cancel</Button>
        </>
      </DialogActions>
    </Dialog>
  );
}

export default forwardRef(AddContact);
