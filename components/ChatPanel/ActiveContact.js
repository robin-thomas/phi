import { useCallback, useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

import Chat from './Chat';
import Loan from './Loan';
import Skeleton from './Skeleton';

import Utils from '../../utils';
import Ceramic from '../../utils/ceramic';
import Thread from '../../utils/textile/thread';
import { useAppContext } from '../hooks';

const ActiveContact = () => {
  const [sent, setSent] = useState(false);
  const [contact, setContact] = useState(null);
  const [accepted, setAccepted] = useState(-1);

  const { page, profile, activeContact, setActiveContact, setContacts } = useAppContext();

  useEffect(() => setAccepted(-1), [activeContact]);
  useEffect(() => Promise.all([ loadProfile(), loadAck() ]), [activeContact]);

  const loadProfile = async () => {
    const ceramic = await Utils.getInstance(Ceramic);
    const _profile = await ceramic.getProfile(activeContact);
    setContact(_profile);
  };

  const loadAck = async () => {
    const thread = await Utils.getInstance(Thread);

    const received = await thread.ack().get(activeContact);
    if (received) {
      setAccepted(1);
    } else {
      const [from] = await window.ethereum.enable();
      const sent = await thread.ack().get(from, activeContact);

      if (sent) {
        setSent(true);
        setAccepted(sent.accepted ? 1 : 3);
      } else {
        // No ack.
        // Check if user is the one who sent the request.
        const result = await thread.invite().findBy({ from, to: activeContact });
        setAccepted(result ? 2 : 0);
      }
    }
  };

  const accept = useCallback(async () => {
    if (window.confirm('Are you sure you want to accept?')) {
      const thread = await Utils.getInstance(Thread);
      await thread.ack().post(true, activeContact);
      setAccepted(1);
    }
  }, [activeContact]);

  const reject = useCallback(async () => {
    if (window.confirm('Are you sure you want to reject?')) {
      const thread = await Utils.getInstance(Thread);
      await thread.ack().post(false, activeContact);

      // Delete this contact from setContacts;
      setContacts((_contacts) => _contacts.filter(c => c !== activeContact));
      setActiveContact(null);
    }
  }, [activeContact, setContacts, setActiveContact]);

  const getAccepted = (_accepted) => {
    switch (_accepted) {
      case 3:
        return 'has rejected your chat request';
      case 2:
        return 'hasnt yet seen your chat request';
      case 0:
        return 'has sent you a chat request';
    }
  }

  return (
    <>
      {page === 'chat' ? (
        <>
          {accepted === -1 ? (
            <Grid item sx={{ mt: -5, pr: 11.75 }}>
              <Skeleton />
            </Grid>
          ) : accepted === 1 ? (
            <Grid
              item
              sx={{ mt: -10 }}
              style={{ position: 'relative', height: '100%' }}
            >
              <Chat sent={sent} />
            </Grid>
          ) : (
            <>
              <h2>Hi, {profile.name}!</h2>
              <h4 style={{ marginTop: '-15px' }}>
                <Tooltip arrow placement="bottom" title={activeContact}>
                  <Button variant="text" color="info" size="large" sx={{ ml: '-10px' }}>
                    <b style={{ fontSize: 21 }}>{contact.name}</b>
                  </Button>
                </Tooltip>
                {getAccepted(accepted)}
              </h4>
              {accepted === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs="auto">
                    <Button variant="contained" color="success" size="large" onClick={accept}>Accept</Button>
                  </Grid>
                  <Grid item xs="auto">
                    <Button variant="outlined" color="error" size="large" onClick={reject}>Reject</Button>
                  </Grid>
                </Grid>
              )}
            </>
          )}
        </>
      ) : (
        <Loan />
      )}
    </>
  )
}

export default ActiveContact;
