import { createContext, useState, useEffect, useCallback } from 'react';

import Utils from '../utils';
import Ceramic from '../utils/ceramic';
import Bucket from '../utils/textile/bucket';
import Thread from '../utils/textile/thread';

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [profile, setProfile] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profileKey, setProfileKey] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [contacts, setContacts] = useState(null);
  const [activeContact, setActiveContact] = useState(null);
  const [loadingContacts, setLoadingContacts] = useState(false);

  useEffect(() => authenticated && getProfileKey(), [authenticated]);
  useEffect(() => authenticated && getProfile(), [authenticated]);

  const callback = useCallback(async (reply, err) => {
    const [address] = await window.ethereum.enable();

    if (!err && reply?.collectionName === process.env.TEXTILE_COLLECTION_INVITE) {
      // chat request received.
      if (reply?.instance?.to === address.toLowerCase()) {
        setContacts((_contacts) => [reply.instance.from, ..._contacts]);

        // Perform decryption.
        const ceramic = await Utils.getInstance(Ceramic);
        const dbInfo = await ceramic.decrypt(reply.instance.dbInfo);
        console.debug('dbInfo', dbInfo);

      } else if (reply?.instance?.from === address.toLowerCase()) {
        setContacts((_contacts) => [reply.instance.to, ..._contacts]);
        setLoadingContacts(false);
      }
    }
  }, []);

  const getProfile = async () => {
    const ceramic = await Utils.getInstance(Ceramic);
    const _profile = await ceramic.getProfile();

    // first time.
    _profile.name = _profile?.name || 'John Doe';
    _profile.description = _profile.description || 'Available';

    setProfile(_profile);
  }

  const getProfileKey = async () => {
    const bucket = await Utils.getInstance(Bucket);
    const key = await bucket.getKey(process.env.TEXTILE_BUCKET_PROFILE);
    console.debug('Retrieved textile key for profile bucket');
    setProfileKey(key);
  }

  useEffect(() => {
    (async () => {
      const thread = await Utils.getInstance(Thread);
      const { sent, received } = await thread.invite().get();

      // const ids = [...sent.map(c => c._id), ...received.map(c => c._id)];
      // console.log('ids', ids);
      // await thread.invite().delete(ids);

      setContacts([
        ...sent.map(c => c.to),
        ...received.map(c => c.from),
      ]);

      console.debug('Listening to chat invites thread');
      const close = thread.listen(callback);

      return () => close();
    })();
  }, [callback]);

  useEffect(() => {
    (async () => {
      if (profile.image && profileKey) {
        const bucket = await Utils.getInstance(Bucket);
        const ceramic = await Utils.getInstance(Ceramic);
        const _profile = await bucket.getImage(profileKey, ceramic.address, profile.image.original.mimeType);
        setProfilePic(_profile);
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
        activeContact,
        setActiveContact,
        loadingContacts,
        setLoadingContacts,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export { DataContext };
export default DataProvider;
