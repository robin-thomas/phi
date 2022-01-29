import SearchContacts from './SearchContacts';
import SearchInput from './SearchInput';
import Skeleton from './Skeleton';
import { useAppContext } from '@/modules/common/hooks';

const Search = () => {
  const { contacts } = useAppContext();

  // loading contacts. show skeleton meanwhile.
  if (!contacts) {
    return (
      <Skeleton
        variant="rect"
        animation="wave"
        height={41}
        sx={{ bgcolor: "#c57e9e", borderRadius: 5 }}
      />
    );
  }

  // enable the search input.
  if (contacts.length > 0) {
    return <SearchContacts />;
  }

  // disable if no contacts.
  return null;
}

export { SearchInput };
export default Search;
