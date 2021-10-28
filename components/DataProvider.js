import { createContext, useState, useEffect } from 'react';
import { useMoralis } from 'react-moralis';

import Bucket from '../utils/bucket';
import { getSelfProfile } from '../utils/ceramic';

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [profile, setProfile] = useState({});
  const [showProfile, setShowProfile] = useState(false);
  const [profileKey, setProfileKey] = useState(null);

  const { isAuthenticated } = useMoralis();

  useEffect(() => {
    (async () => {
      const bucket = await Bucket.getInstance();
      const key = await bucket.getKey(process.env.TEXTILE_PIC_BUCKET);
      console.log('key', key);
      setProfileKey(key);
    })();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getSelfProfile()
        .then((_profile) => {
          // first time.
          if (!_profile?.name) {
            _profile = { ..._profile, name: 'John Doe' };
          }
          if (!_profile?.description) {
            _profile = { ..._profile, description: 'Available' };
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
        showProfile,
        setShowProfile,
        profileKey,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export { DataContext };
export default DataProvider;
