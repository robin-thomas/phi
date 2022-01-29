import { useFormik } from 'formik';
import * as yup from 'yup';

import SearchInput from './SearchInput';
import { useAppContext } from '@/modules/common/hooks';
import { searchProfiles } from '@/modules/profile/utils/ceramic';

const SearchContacts = () => {
  const { contacts, setSearchResults, checkingContact, setCheckingContact } = useAppContext();

  const formik = useFormik({
    initialValues: { search: '' },
    validationSchema: yup.object({
      search: yup
        .string()
        //.notOneOf([user?.attributes?.ethAddress], 'That\'s your address!')
    }),
    onSubmit: async (values) => {
      if (values.search) {
        setCheckingContact(true);

        const _profiles = searchProfiles(values.search);
        setSearchResults(_profiles || []);

        setCheckingContact(false);
      } else {
        setSearchResults(contacts);
      }
    },
    enableReinitialize: true,
  });

  return (
    <SearchInput
      name="search"
      placeholder="Ethereum address"
      formik={formik}
      onChange={formik.handleSubmit}
      disabled={checkingContact}
    />
  );
}

export default SearchContacts;
