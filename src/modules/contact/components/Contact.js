import { useEffect, useState } from 'react';

import Avatar from '@mui/material/Avatar';

import styles from './index.module.css';
import { Skeleton, ContactCard } from '@/layouts/core/ContactCard';
import { useWithProfilePicture } from '@/modules/profile/hooks';
import { getProfile } from '@/modules/profile/utils/ceramic';

const BaseContact = ({ profile, action, onClick, classes }) => {
  const src = useWithProfilePicture(profile);

  return (
    <ContactCard
      classes={{ root: classes }}
      onClick={onClick}
      avatar={<Avatar src={src} width={50} height={50} />}
      title={profile.name}
      subheader={profile.description}
      action={action}
    />
  );
}

const Contact = ({ profile, ...props }) => {
  const [user, setUser] = useState(profile.name ? profile : null);

  useEffect(() => {
    if (!profile.name) {
      getProfile(profile.address)
        .then(setUser);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return <Skeleton />;
  }

  if (props.active) {
    return (
      <BaseContact
        {...props}
        profile={user}
        classes={`${styles.container} ${styles.clickable} ${styles.active}`}
      />
    );
  }

  if (props.action) {
    return (
      <BaseContact
        {...props}
        profile={user}
        classes={`${styles.container} ${styles.active}`}
      />
    );
  }

  return (
    <BaseContact
      {...props}
      profile={user}
      classes={`${styles.container} ${styles.clickable}`}
    />
  );
};

export default Contact;
