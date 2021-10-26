import { useEffect } from 'react';
import { useMoralis } from 'react-moralis';

import Settings from './Settings';

const Header = () => {
  const { isAuthenticated } = useMoralis();

  return (
    <>
      {isAuthenticated && <Settings />}
    </>
  )
}

export default Header;
