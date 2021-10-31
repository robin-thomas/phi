import { createContext, useState, useEffect, useCallback } from 'react';

import Bucket from '../utils/textile/bucket';
import Thread from '../utils/textile/thread';
import { getSelfProfile } from '../utils/ceramic';

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [profile, setProfile] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profileKey, setProfileKey] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [contacts, setContacts] = useState([
    '0x110c2cc44c06865De20c157D42B701aF8438d18A',
    '0x110c2cc44c06865De20c157D42B701aF8438d18A',
    '0x110c2cc44c06865De20c157D42B701aF8438d18A',
    '0x110c2cc44c06865De20c157D42B701aF8438d18A',
  ]);

  const callback = useCallback(async (reply, err) => {
    const [address] = await window.ethereum.enable();

    if (!err) {
      // chat request received.
      if (reply?.instance?.to === address.toLowerCase()) {
        console.debug('chat request: ', reply.instance.from);
      }
    } else {
      console.error(err, reply);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const bucket = await Bucket.getInstance();
      const key = await bucket.getKey(process.env.TEXTILE_PROFILE_BUCKET);
      console.debug('Retrieved textile key for profile bucket', key);
      setProfileKey(key);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const thread = await Thread.getInstance();
      console.debug('Listening to chat invites thread');
      thread.listen(callback);
    })();
  }, [callback]);

  useEffect(() => {
    (async () => {
      if (authenticated) {
        const _profile = await getSelfProfile();

        // first time.
        _profile.name = _profile?.name || 'John Doe';
        _profile.description = _profile.description || 'Available';

        setProfile(_profile);
      }
    })();
  }, [authenticated]);

  useEffect(() => {
    (async () => {
      if (profile.image && profileKey) {
        const [address] = await window.ethereum.enable();
        const bucket = await Bucket.getInstance();
        setProfilePic(await bucket.getImage(profileKey, address, profile.image.original.mimeType));
      }
    })();
  }, [profile.image, profileKey]);

  useEffect(() => {
    const callback = (chainId) => {
      if (chainId !== process.env.ETH_CHAIN_ID) {
        window.location.reload();
      }
    }

    if (window.ethereum) {
      window.ethereum.on('chainChanged', callback);
      return () => window.ethereum.removeListener('chainChanged', callback)
    }
  }, []);

  return (
    <DataContext.Provider
      value={{
        profile,
        setProfile,
        profilePic,
        showProfile,
        setShowProfile,
        profileKey,
        contacts,
        setContacts,
        authenticated,
        setAuthenticated,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export { DataContext };
export default DataProvider;
