import { createContext, useState, useEffect } from 'react';

import { self } from '../utils/ceramic';
import { ETH_CHAIN_ID } from '@/app/config/app';
import Bucket from '@/modules/file/utils/bucket';
import { downloadProfilePicture } from '@/modules/file/utils/image';
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
    if (provider && address) {
      ChatUtil.setAddress(address);

      self(address, provider)
        .then(() => getProfile(address, true /* self profile */))
        .then((_profile) => setProfile({..._profile, address}));
    } else {
      setProfile({});
    }
  }, [address, provider]);

  useEffect(() => {
    if (profile?.address && profile?.image && profileKey) {
      downloadProfilePicture(profileKey, profile.address, profile.image.original.mimeType).then(setProfilePic);
    }
  }, [profile?.address, profile?.image, profileKey]);

  useEffect(() => {
    const getContacts = async () => {
      await loadFriendRequests(profile.address);

      const { received, sent } = getAllInvites();

      return [
        ...sent.map(c => c?.to),
        ...received.map(c => c?.from),
      ];
    }

    if (profile?.address) {
      getContacts().then((_contacts) => {
        const filtered = _contacts.filter(e => Boolean(e));

        const getInviteOrAck = (contact) => {
          return Ack.get(contact, profile.address) || Ack.get(profile.address, contact) || getInvite(contact, profile.address) || getInvite(profile.address, contact);
        }

        // Sort them based on the last message.
        filtered.sort((a, b) => getInviteOrAck(a).date <= getInviteOrAck(b).date ? 1 : -1);

        setContacts(filtered);
      });
    } else {
      setContacts(null);
    }
  }, [profile?.address]);

  useEffect(() => setSearchResults(contacts), [contacts]);

  useEffect(() => {
    const networkChanged = (chainId) => {
      if (chainId !== ETH_CHAIN_ID) {
        window.location.reload();
      } else if (provider) {
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
  }, [provider]);

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
        const result = getInvite(contact, profile.address) || getInvite(profile.address, contact);
        if (result?.dbInfo?.threadID) {
          ids[contact] = result.dbInfo.threadID;
        }
      }

      setThreadIDs(ids);
    }

    if (profile?.address && contacts) {
      retrieveThreadIDs();
    }
  }, [profile?.address, contacts]);

  useEffect(() => {
    const setChatListeners = async () => {
      const closeListeners = [];

      for (const contact of Object.keys(threadIDs)) {
        const { close } = await ChatUtil.listen(threadIDs[contact], contact, (chat) => {
          if (chat?.to === profile?.address) {
            setUnreadCount(count => ({ ...count, [chat.from]: (count[chat.from] || 0) + 1 }));

            // Move chat.from contact to top.
            const _contacts = contacts.filter(e => e !== chat.from);
            setContacts([chat.from, ..._contacts]);
          }

          setUpdateChats(_count => _count + 1);
        });

        closeListeners.push(close);
      }

      return closeListeners;
    }

    if (threadIDs) {
      const promise = setChatListeners();

      return () => {
        promise.then((closeListeners) => closeListeners.map(fn => fn()));
      };
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
