import { useFormik } from 'formik';
import * as yup from 'yup';

import SearchInput from './SearchInput';
import { useAppContext } from '@/modules/common/hooks';
import { searchProfiles } from '@/modules/profile/utils/ceramic';

const SearchContacts = () => {
  const { profile, contacts, setSearchResults } = useAppContext();

  const formik = useFormik({
    initialValues: { search: '' },
    validationSchema: yup.object({
      search: yup
        .string()
        .lowercase()
        .notOneOf([profile.address], 'That\'s your address!')
    }),
    onSubmit: async (values) => {
      if (values.search) {
        const profiles = searchProfiles(values.search);
        setSearchResults(profiles);
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
    />
  );
}

export default SearchContacts;
