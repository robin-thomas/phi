import { createContext, useState, useEffect, useCallback } from 'react';

import Utils from '../utils';
import Ceramic from '../utils/ceramic';
import Bucket from '../utils/textile/bucket';
import Thread from '../utils/textile/thread';

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [network, setNetwork] = useState(null);
  const [profile, setProfile] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profileKey, setProfileKey] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [contacts, setContacts] = useState(null);
  const [activeContact, setActiveContact] = useState(null);
  const [loadingContacts, setLoadingContacts] = useState(false);

  useEffect(() => getProfileKey(), []);
  useEffect(() => authenticated && getProfile(), [authenticated]);
  useEffect(() => authenticated && getContacts(), [authenticated]);

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
    const networkChanged = (chainId) => {
      if (chainId !== process.env.ETH_CHAIN_ID) {
        window.location.reload();
      } else {
        setNetwork(process.env.ETH_CHAIN_NAME);
      }
    }

    const accountChanged = () => window.location.reload();

    // Metamask callback for changes.
    if (window.ethereum) {
      window.ethereum.on('chainChanged', networkChanged);
      window.ethereum.on('accountsChanged', accountChanged);

      return () => {
        window.ethereum.removeListener('chainChanged', networkChanged);
        window.ethereum.removeListener('accountsChanged', accountChanged);
      };
    }
  }, []);

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

  useEffect(() => {
    if (authenticated) {
      console.debug('Listening to chat invites thread');

      Utils.getInstance(Thread)
        .then((thread) => {
          const close = thread.listen(callback);
          return () => close();
        });
    }
  }, [authenticated, callback]);

  const getProfileKey = async () => {
    const bucket = await Utils.getInstance(Bucket);
    const key = await bucket.getKey(process.env.TEXTILE_BUCKET_PROFILE);
    console.debug('Retrieved textile key for profile bucket');
    setProfileKey(key);
  }

  const getProfile = async () => {
    const ceramic = await Utils.getInstance(Ceramic);
    const _profile = await ceramic.getProfile();
    setProfile(_profile);
  }

  const getContacts = async () => {
    const thread = await Utils.getInstance(Thread);
    const { sent, received } = await thread.invite().get();

    setContacts([
      ...sent.map(c => c.to),
      ...received.map(c => c.from),
    ]);
  }

  return (
    <DataContext.Provider
      value={{
        network,
        setNetwork,
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
