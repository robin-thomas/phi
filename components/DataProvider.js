import { createContext, useState, useEffect } from 'react';
import { useMoralis } from 'react-moralis';

import Utils from '../utils';
import Ceramic from '../utils/ceramic';
import Bucket from '../utils/textile/bucket';
import Thread from '../utils/textile/thread';

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const { user } = useMoralis();

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

  useEffect(() => {
    Utils.getInstance(Bucket)
      .then(bucket => bucket.getKey(process.env.TEXTILE_BUCKET_PROFILE))
      .then(setProfileKey);
  }, []);

  useEffect(() => {
    if (authenticated) {
      Utils.getInstance(Ceramic)
        .then(ceramic => ceramic.getProfile())
        .then(setProfile);
    }
  }, [authenticated]);

  useEffect(() => {
    if (authenticated) {
      Utils.getInstance(Thread)
        .then(thread => {
          thread.ack(user.get('ethAddress')).load();
          return thread.invite(user.get('ethAddress')).getAll();
        })
        .then(({ received, sent }) => {
          const _contacts = [
            ...sent.map(c => c?.to),
            ...received.map(c => c?.from),
          ];

          setContacts(_contacts.filter(e => e !== undefined && e !== null));
        });
    }
  }, [authenticated]);

  useEffect(() => {
    if (profile?.image && profileKey) {
      Utils.getInstance(Bucket)
        .then(bucket => bucket.getImage(profileKey, user.get('ethAddress'), profile.image.original.mimeType))
        .then(setProfilePic);
    }
  }, [profile.image, profileKey, user]);

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
      const response = await thread.ack(user.get('ethAddress')).callback(reply, err);
      if (!response?.ack) {
        const invite = await thread.invite(user.get('ethAddress')).callback(reply, err);

        if (invite?.sent === false) {
          setContacts((_contacts) => [invite.address, ..._contacts]);
        } else if (response?.sent === true) {
          setContacts((_contacts) => [invite.address, ..._contacts]);
          setLoadingContacts(false);
        }
      }
    };

    if (contacts !== null) {
      console.debug('Listening to chat invites thread');
      Utils.getInstance(Thread).then(thread => thread.listen(callback))
    }
  }, [contacts]);

  useEffect(() => {
    if (activeContact) {
      Utils.getInstance(Ceramic)
        .then(ceramic => ceramic.getProfile(activeContact))
        .then(setActiveContactProfile);
    } else {
      setActiveContactProfile(null);
    }
  }, [activeContact]);

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
