import { createContext, useState, useEffect } from 'react';
import { useMoralis } from 'react-moralis';

import Bucket from '../utils/textile/bucket';
import Thread from '../utils/textile/thread';
import { getSelfProfile } from '../utils/ceramic';

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [profile, setProfile] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profileKey, setProfileKey] = useState(null);

  const { isAuthenticated } = useMoralis();

  useEffect(() => {
    (async () => {
      const bucket = await Bucket.getInstance();
      const key = await bucket.getKey(process.env.TEXTILE_PROFILE_BUCKET);
      console.debug('Retrieved textile key for profile bucket', key);
      setProfileKey(key);

      const thread = await Thread.getInstance();
      console.debug('Listening to chat invites thread');
      await thread.join(console.log);
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

  useEffect(() => {
    (async () => {
      if (profile.image && profileKey) {
        const [address] = await window.ethereum.enable();
        const bucket = await Bucket.getInstance();
        setProfilePic(await bucket.getImage(profileKey, address, profile.image.original.mimeType));
      }
    })();
  }, [profile.image, profileKey]);

  return (
    <DataContext.Provider
      value={{
        profile,
        setProfile,
        profilePic,
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
