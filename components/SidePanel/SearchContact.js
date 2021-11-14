import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useMoralis } from 'react-moralis';
import * as yup from 'yup';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import SimpleBar from 'simplebar-react';

import Contact from './Contact';
import Search from './Search';
import SkeletonContact from './SkeletonContact';

import { useAppContext } from '../hooks';
import Utils from '../../utils';
import Ceramic from '../../utils/ceramic';

const SearchContact = () => {
  const { user } = useMoralis();
  const { profileKey, contacts, activeContact, setActiveContact } = useAppContext();

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
      {profileKey ? (
        <Search
          name="search"
          placeholder="Ethereum address"
          formik={formik}
          onChange={formik.handleSubmit}
          disabled={contacts?.length === 0 || checkingContact}
        />
      ) : (
        <Skeleton variant="rect" animation="wave" height={41} sx={{ bgcolor: "#c57e9e", borderRadius: 5 }} />
      )}
      <Divider sx={{ mt: 2, mb: 2 }}/>
      {profiles?.length > 0 ? (
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
      ) : profiles === null && (
        <Stack>
          <SkeletonContact />
          <SkeletonContact />
          <SkeletonContact />
        </Stack>
      )}
    </>
  )
}

export default SearchContact;
