import { useEffect } from 'react';

import Button from '@mui/material/Button';

import { isLoggedIn, login } from '../utils/onboard';
import { useAppContext } from '@/modules/common/hooks';

const Login = () => {
  const { setProvider, setNetwork } = useAppContext();

  const authenticate = () => login(async (provider) => {
    if (provider) {
      setProvider(provider);

      const network = await provider.getNetwork();
      setNetwork(network?.name || null);
    } else {
      setProvider(null);
      setNetwork(null);
    }
  });

  useEffect(() => isLoggedIn() && authenticate(), []); // eslint-disable-line

  return (
    <Button variant="contained" onClick={authenticate}>Connect Wallet</Button>
  );
}

export default Login;
