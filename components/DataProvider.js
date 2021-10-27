import { createContext, useState, useEffect } from 'react';
import { useMoralis } from 'react-moralis';

import { getSelfProfile } from '../utils/ceramic';

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [profile, setProfile] = useState({});

  const { isAuthenticated } = useMoralis();

  useEffect(() => {
    if (isAuthenticated) {
      getSelfProfile()
        .then((_profile) => {
          // first time.
          if (!profile?.name) {
            _profile = { name: 'John Doe', description: 'Available' };
          }

          setProfile(_profile);
        });
    }
  }, [isAuthenticated]);

  return (
    <DataContext.Provider
      value={{
        profile,
        setProfile,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export { DataContext };
export default DataProvider;
