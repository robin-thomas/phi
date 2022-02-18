import Avatar from '@mui/material/Avatar';
import MUIBox from '@mui/material/Box';
import SimpleBar from 'simplebar-react';

import Contact from './Contact';
import { Skeleton } from '@/layouts/core/ContactCard';
import { useAppContext } from '@/modules/common/hooks';

const Action = ({ count }) => (
  <MUIBox
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="5vh"
  >
    <Avatar sx={{ width: 26, height: 26, bgcolor: 'rgb(197,126,126)' }}>
      {count}
    </Avatar>
  </MUIBox>
);

const ContactList = () => {
  const { activeContact, setActiveContact, searchResults, unreadCount } = useAppContext();

  const onContact = (address) => () => setActiveContact(_active => _active === address ? null : address);

  if (!searchResults) {
    return <Skeleton count={3} />;
  }

  if (searchResults.length === 0) {
    return null;
  }

  return (
    <SimpleBar style={{ height: '425px' }}>
      {searchResults.map((address) => (
        <Contact
          key={address}
          profile={{ address }}
          active={activeContact === address}
          onClick={onContact(address)}
          action={unreadCount[address] ? <Action count={unreadCount[address]} /> : undefined}
        />
      ))}
    </SimpleBar>
  );
}

export default ContactList;
