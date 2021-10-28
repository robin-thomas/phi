import { useState } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useMoralis } from 'react-moralis';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from '@mui/material/FormHelperText';

import Contact from './Contact';

import { getProfile } from '../../utils/ceramic';
import { useAppContext } from '../hooks';

const Contacts = () => {
  const { isAuthenticated, user } = useMoralis();
  const { profileKey } = useAppContext();

  const [profile, setProfile] = useState({});
  const [addContact, setAddContact] = useState(false);
  const [checkingContact, setCheckingContact] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: { address: '' },
    validationSchema: yup.object({
      address: yup
        .string()
        .matches(/^(0x){1}[0-9a-fA-F]{40}$/, 'Not valid ethereum address')
        .notOneOf([user?.attributes?.ethAddress], 'That\'s your address!')
        .required()
    }),
    onSubmit: async (values) => {
      setCheckingContact(true);
      const _profile = await getProfile(values.address);
      setProfile(_profile || { notfound: null });
      setCheckingContact(false);
    },
    enableReinitialize: true,
  });

  if (!isAuthenticated || !profileKey) {
    return null;
  }

  return (
    <>
      <Box sx={{ px: 2, height: 'calc(100% - 120px)' }}>
        {addContact && (
          <Card
            sx={{ pt: 4, height: '100%' }}
            style={{
              backgroundColor: 'transparent',
              backgroundImage: 'none',
              boxShadow: 'none',
            }}
          >
            <CardHeader
              title="Add New Contact"
              action={(
                <IconButton onClick={() => setAddContact(false)} disabled={checkingContact}>
                  <CloseIcon />
                </IconButton>
              )}
            />
            <Box sx={{ px: 2, mt: 5 }}>
              <FormControl variant="standard" fullWidth error={formik.touched.address && Boolean(formik.errors.address)}>
                <InputLabel shrink>Ethereum Address</InputLabel>
                <Input
                  name="address"
                  value={formik.values.address}
                  onChange={(e) => {
                    formik.setFieldTouched('address');
                    formik.handleChange(e);
                    setProfile('');
                  }}
                  onBlur={formik.handleSubmit}
                  disabled={checkingContact}
                  autoComplete='off'
                  endAdornment={(
                    <InputAdornment position="end">
                      {checkingContact ? (
                        <CircularProgress color="secondary" size={25} />
                      ) : formik.touched.address && !formik.errors.address && !profile ? (
                        <Tooltip title="Save" placement="top" arrow>
                          <IconButton
                            color="primary"
                            onClick={formik.handleSubmit}
                          >
                            <CheckIcon />
                          </IconButton>
                        </Tooltip>
                      ) : null}
                    </InputAdornment>
                  )}
                />
                <FormHelperText>{formik.touched.address && formik.errors.address}</FormHelperText>
              </FormControl>
              <Contact address={formik.values.address} profile={profile} />
            </Box>
          </Card>
        )}
        {!addContact && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 900 }}>No friends yet.</h2>
            <h4 style={{ marginTop: '-10px', color: 'rgba(255, 255, 255, 0.6)' }}>Go ahead and add a friend!</h4>
          </Box>
        )}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mr: 2, mt: -10 }}>
        <Tooltip title="Add New Contact" arrow placement="top">
          <Fab onClick={() => setAddContact(true)}>
            <AddIcon />
          </Fab>
        </Tooltip>
      </Box>
    </>
  )
};

export default Contacts;
