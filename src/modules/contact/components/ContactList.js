import SimpleBar from 'simplebar-react';

import Contact from './Contact';
import { Skeleton } from '@/layouts/core/ContactCard';
import { useAppContext } from '@/modules/common/hooks';
import { useWithProfiles } from '@/modules/profile/hooks';

const ContactList = () => {
  const { activeContact, setActiveContact, searchResults } = useAppContext();
  const profiles = useWithProfiles(searchResults);

  const onContact = (address) => () => setActiveContact(_active => _active === address ? null : address);

  if (!searchResults) {
    return <Skeleton count={3} />;
  }

  if (profiles.length === 0) {
    return null;
  }

  return (
    <SimpleBar style={{ height: '425px' }}>
      {profiles.map((profile) => (
        <Contact
          key={profile.address}
          profile={profile}
          active={activeContact === profile.address}
          onClick={onContact(profile.address)}
        />
      ))}
    </SimpleBar>
  );
}

export default ContactList;
