import { createContext, useState, useEffect } from 'react';
import { useMoralis } from 'react-moralis';

import { getProfile } from '../utils/ceramic';

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [profile, setProfile] = useState({});

  const { isAuthenticated } = useMoralis();

  useEffect(() => {
    if (isAuthenticated) {
      getProfile().then(setProfile);
    }
  }, [isAuthenticated]);

  return (
    <DataContext.Provider
      value={{
        profile,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export { DataContext };
export default DataProvider;
