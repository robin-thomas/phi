import { createContext, useState, useEffect } from 'react';

import Utils from '../utils';
import Ceramic from '../utils/ceramic';
import Bucket from '../utils/textile/bucket';
import Thread from '../utils/textile/thread';

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [page, setPage] = useState('chat');
  const [network, setNetwork] = useState(null);
  const [profile, setProfile] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profileKey, setProfileKey] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [contacts, setContacts] = useState(null);
  const [activeContact, setActiveContact] = useState(null);
  const [activeContactProfile, setActiveContactProfile] = useState(null);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [threadID, setThreadID] = useState(null);
  const [loanIdUpdate, setLoanIdUpdate] = useState(null);

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

  useEffect(() => {
    const callback = async (reply, err) => {
      const thread = await Utils.getInstance(Thread);

      // Verify if invite or ack.
      const response = await thread.ack().callback(reply, err);
      if (!response?.ack) {
        const invite = await thread.invite().callback(reply, err);

        if (invite?.sent === false) {
          setContacts((_contacts) => [invite.address, ..._contacts]);
        } else if (response?.sent === true) {
          setContacts((_contacts) => [invite.address, ..._contacts]);
          setLoadingContacts(false);
        }
      }
    };

    if (authenticated) {
      console.debug('Listening to chat invites thread');

      Utils.getInstance(Thread)
        .then((thread) => thread.listen(callback))
    }
  }, [authenticated]);

  useEffect(() => {
    if (activeContact) {
      Utils.getInstance(Ceramic)
        .then(ceramic => ceramic.getProfile(activeContact))
        .then(setActiveContactProfile);
    } else {
      setActiveContactProfile(null);
    }
  }, [activeContact]);

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
    const { sent, received } = await thread.invite().getAll();

    setContacts(
      [
        ...sent.map(c => c?.to),
        ...received.map(c => c?.from),
      ]
      .filter(e => e !== undefined && e !== null)
    );
  }

  return (
    <DataContext.Provider
      value={{
        page,
        setPage,
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
        activeContactProfile,
        loadingContacts,
        setLoadingContacts,
        threadID,
        setThreadID,
        loanIdUpdate,
        setLoanIdUpdate,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export { DataContext };
export default DataProvider;
