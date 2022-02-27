import LogoutIcon from '@mui/icons-material/Logout';

import { logout } from '../utils/onboard';
import { ListItemButton } from '@/layouts/core/Button';
import { useAppContext } from '@/modules/common/hooks';

const Logout = () => {
  const { profile } = useAppContext();

  return (
    <ListItemButton text="Logout" disabled={!profile?.address} onClick={logout}>
      <LogoutIcon />
    </ListItemButton>
  );
}

export default Logout;
