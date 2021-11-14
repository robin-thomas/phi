import { useMoralis } from 'react-moralis';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import Avatar from '../Profile/Avatar';
import Settings from './Settings';
import SkeletonContact from './SkeletonContact';

import { useAppContext } from '../hooks';
import styles from './Header.module.css';

const Header = () => {
  const { profile } = useAppContext();
  const { isAuthenticated } = useMoralis();

  if (!isAuthenticated) {
    return null;
  }

  if (!profile?.name || !profile?.description) {
    return <SkeletonContact />;
  }

  return (
    <Card classes={{ root: styles.card }}>
      <CardHeader
        avatar={<Avatar mini={true} />}
        action={<Settings />}
        title={profile.name}
        subheader={profile.description}
        classes={{
          title: styles.title,
          subheader: styles.subheader,
        }}
      />
    </Card>
  )
}

export default Header;
