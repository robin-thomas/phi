import { useEffect, useState } from 'react';

import Avatar from '@mui/material/Avatar';
import propTypes from 'prop-types';

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

BaseContact.propTypes = {
  profile: propTypes.object.isRequired,
  action: propTypes.node,
  onClick: propTypes.func,
  classes: propTypes.string,
};

const Contact = ({ profile, ...props }) => {
  const [user, setUser] = useState(profile.name ? profile : null);

  useEffect(() => {
    let mounted = true;

    if (!profile.name) {
      getProfile(profile.address)
        .then((user) => mounted && setUser(user));

      return () => {
        mounted = false;
      };
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

Contact.propTypes = {
  profile: propTypes.object.isRequired,
  active: propTypes.bool,
  action: propTypes.node,
  onClick: propTypes.func,
};

export default Contact;
