import Settings from './Settings';
import { ContactCard, Skeleton } from '@/layouts/core/ContactCard';
import { useAppContext } from '@/modules/common/hooks';
import Avatar from '@/modules/profile/components/Avatar';

const Header = () => {
  const { profile, address } = useAppContext();

  if (!address) {
    return null;
  }

  if (!profile?.name || !profile?.description) {
    return <Skeleton />;
  }

  return (
    <ContactCard
      avatar={<Avatar mini={true} />}
      action={<Settings />}
      title={profile.name}
      subheader={profile.description}
    />
  );
}

export default Header;
