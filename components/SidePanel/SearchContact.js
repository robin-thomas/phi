import { useState } from 'react';
import { useFormik } from 'formik';
import { useMoralis } from 'react-moralis';
import * as yup from 'yup';
import Divider from '@mui/material/Divider';

import Contact from './Contact';
import Search from './Search';

const SearchContact = () => {
  const [profiles, setProfiles] = useState([]);
  const [checkingContact, setCheckingContact] = useState(false);
  const { user } = useMoralis();

  const formik = useFormik({
    initialValues: { address: '' },
    validationSchema: yup.object({
      address: yup
        .string()
        .matches(/^(0x){1}[0-9a-fA-F]{40}$/, 'Not valid ethereum address')
        .notOneOf([user?.attributes?.ethAddress], 'That\'s your address!')
    }),
    onSubmit: async (values) => {
      if (values.address) {
        setCheckingContact(true);
        const _profile = await getProfile(values.address);
        setProfile([_profile || { notfound: null }]);
        setCheckingContact(false);
      }
    },
    enableReinitialize: true,
  });

  return (
    <>
      <Search
        name="address"
        placeholder="Ethereum address"
        formik={formik}
        onChange={() => setProfiles([])}
        disabled={checkingContact}
      />
      <Divider sx={{ mt: 2, mb: 2 }}/>
      {profiles.map((profile) => (
        <Contact key={profile?.address} address={profile?.address} profile={profile} />
      ))}
    </>
  )
}

export default SearchContact;
