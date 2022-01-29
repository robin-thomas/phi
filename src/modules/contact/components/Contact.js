import Avatar from '@mui/material/Avatar';

import styles from './index.module.css';
import { ContactCard } from '@/layouts/core/ContactCard';
import { useWithProfilePicture } from '@/modules/profile/hooks';

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

const Contact = (props) => {
  if (props.active) {
    return (
      <BaseContact
        {...props}
        classes={`${styles.container} ${styles.clickable} ${styles.active}`}
      />
    );
  }

  if (props.action) {
    return (
      <BaseContact
        {...props}
        classes={`${styles.container} ${styles.active}`}
      />
    );
  }

  return (
    <BaseContact
      {...props}
      classes={`${styles.container} ${styles.clickable}`}
    />
  );
};

export default Contact;
