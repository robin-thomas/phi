import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useMoralis } from 'react-moralis';
import * as yup from 'yup';
import Divider from '@mui/material/Divider';
import SimpleBar from 'simplebar-react';

import Contact from './Contact';
import Search from './Search';

import { useAppContext } from '../hooks';
import Utils from '../../utils';
import Ceramic from '../../utils/ceramic';

const SearchContact = () => {
  const { user } = useMoralis();
  const { contacts, activeContact, setActiveContact } = useAppContext();

  const [profiles, setProfiles] = useState(contacts);
  const [checkingContact, setCheckingContact] = useState(false);

  useEffect(() => setProfiles(contacts), [contacts]);

  const formik = useFormik({
    initialValues: { search: '' },
    validationSchema: yup.object({
      address: yup
        .string()
        .notOneOf([user?.attributes?.ethAddress], 'That\'s your address!')
    }),
    onSubmit: async (values) => {
      if (values.search) {
        setCheckingContact(true);

        const ceramic = await Utils.getInstance(Ceramic);
        const _profiles = ceramic.searchProfiles(values.search);
        setProfiles(_profiles || [{ notfound: null }]);

        setCheckingContact(false);
      } else {
        setProfiles(contacts);
      }
    },
    enableReinitialize: true,
  });

  return (
    <>
      <Search
        name="search"
        placeholder="Ethereum address"
        formik={formik}
        onChange={formik.handleSubmit}
        disabled={checkingContact}
      />
      <Divider sx={{ mt: 2, mb: 2 }}/>
      <SimpleBar style={{ height: '425px' }}>
        {profiles.map((profile) => (
          <Contact
            key={profile}
            address={profile}
            active={activeContact === profile}
            checkingContact
            onClick={() => setActiveContact((_active) => (_active === profile ? null : profile))}
          />
        ))}
      </SimpleBar>
    </>
  )
}

export default SearchContact;
