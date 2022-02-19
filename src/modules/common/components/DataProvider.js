import { createContext, useState, useEffect } from 'react';

import { ETH_CHAIN_ID } from '@/app/config/app';
import Bucket from '@/modules/file/utils/bucket';
import { downloadProfilePictureFromBucket } from '@/modules/file/utils/image';
import { Ack, Invite, loadFriendRequests, getAllInvites, getInvite } from '@/modules/friendrequest/utils';
import ChatUtil from '@/modules/message/utils/textile/chat';
import { TEXTILE_BUCKET_PROFILE } from '@/modules/profile/constants/textile';
import { getProfile } from '@/modules/profile/utils/ceramic';

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [network, setNetwork] = useState(null);
  const [profile, setProfile] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profileKey, setProfileKey] = useState(null);
  const [address, setAddress] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [contacts, setContacts] = useState(null);
  const [activeContact, setActiveContact] = useState(null);
  const [activeContactProfile, setActiveContactProfile] = useState(null);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [checkingContact, setCheckingContact] = useState(false);
  const [provider, setProvider] = useState(null);
  const [threadIDs, setThreadIDs] = useState({});
  const [unreadCount, setUnreadCount] = useState({});
  const [updateChats, setUpdateChats] = useState(0);

  useEffect(() => Bucket.getKey(TEXTILE_BUCKET_PROFILE).then(setProfileKey), []);

  useEffect(() => {
    if (address) {
      ChatUtil.setAddress(address);
      getProfile(address, true /* self profile */).then(setProfile);
    } else {
      setProfile({});
    }
  }, [address]);

  useEffect(() => {
    const download = async () => {
      const pic = downloadProfilePictureFromBucket(profileKey, address, profile.image.original.mimeType);
      setProfilePic(pic);
    }

    if (profile?.image && profileKey) {
      download();
    }
  }, [address, profile.image, profileKey]);

  useEffect(() => {
    const getContacts = async () => {
      await loadFriendRequests(address);

      const { received, sent } = getAllInvites();

      return [
        ...sent.map(c => c?.to),
        ...received.map(c => c?.from),
      ];
    }

    if (address) {
      getContacts().then((_contacts) => setContacts(_contacts.filter(e => e !== undefined && e !== null)));
    } else {
      setContacts(null);
    }
  }, [address]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => setSearchResults(contacts), [contacts]);

  useEffect(() => {
    const networkChanged = (chainId) => {
      if (chainId !== ETH_CHAIN_ID) {
        window.location.reload();
      } else {
        provider.getNetwork().then(_network => setNetwork(_network?.name || null));
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
      const invite = await Invite.callback(reply, err);

      if (invite?.sent === false) {
        setContacts((_contacts) => [invite.address, ..._contacts]);
      } else if (invite?.sent === true) {
        setContacts((_contacts) => [invite.address, ..._contacts]);
        setLoadingContacts(false);
      }
    };

    if (contacts) {
      Ack.addThreadListener();
      Invite.addThreadListener(callback);
    }
  }, [contacts]);

  useEffect(() => {
    const retrieveThreadIDs = () => {
      const ids = {};

      for (const contact of contacts) {
        const result = getInvite(contact, address) || getInvite(address, contact);
        if (result?.dbInfo?.threadID) {
          ids[contact] = result.dbInfo.threadID;
        }
      }

      setThreadIDs(ids);
    }

    if (contacts) {
      retrieveThreadIDs();
    }
  }, [address, contacts]);

  useEffect(() => {
    const setChatListeners = async () => {
      const closeListeners = [];

      for (const contact of Object.keys(threadIDs)) {
        const fn = await ChatUtil.listen(threadIDs[contact], contact, (chat) => {
          if (chat?.to === address) {
            setUnreadCount(count => ({ ...count, [chat.from]: (count[chat.from] || 0) + 1 }));
          }

          setUpdateChats(_count => _count + 1);
        });

        closeListeners.push(fn);
      }

      return closeListeners;
    }

    if (threadIDs) {
      setChatListeners()
        .then((closeListeners) => closeListeners.map(fn => fn()));
    }
  }, [threadIDs]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (activeContact) {
      getProfile(activeContact).then(setActiveContactProfile);
    } else {
      setActiveContactProfile(null);
    }
  }, [activeContact]);

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
        searchResults, setSearchResults,
        contacts,
        setContacts,
        address,
        setAddress,
        activeContact,
        setActiveContact,
        activeContactProfile,
        loadingContacts,
        setLoadingContacts,
        checkingContact,
        setCheckingContact,
        provider, setProvider,
        unreadCount, setUnreadCount,
        threadIDs,
        updateChats,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export { DataContext };
export default DataProvider;
