import { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';

import { useAppContext } from '@/modules/common/hooks';
import { STATUS, STATUS_MESSAGE } from '@/modules/friendrequest/constants/status';
import { acceptOrReject, getAck, getInvite } from '@/modules/friendrequest/utils';
import { Skeleton } from '@/modules/message/components';
import Chat from '@/modules/message/components/Chat';

const ActiveContact = () => {
  const [sent, setSent] = useState(false);
  const [accepted, setAccepted] = useState(STATUS.PENDING);

  const { profile, activeContact, activeContactProfile, setActiveContact, setContacts } = useAppContext();

  useEffect(() => setAccepted(STATUS.PENDING), [activeContact]);

  useEffect(() => {
    const loadActiveContact = async () => {
      const sentAck = getAck(profile.address, activeContact);
      const receivedAck = getAck(activeContact, profile.address);
      const pendingAck = getInvite(profile.address, activeContact);

      if (sentAck) {
        setSent(false);
        setAccepted(STATUS.ACCEPTED); // TODO.
      } else if (receivedAck) {
        setSent(true);
        setAccepted(receivedAck.accepted ? STATUS.ACCEPTED : STATUS.REJECTED);
      } else {
        // No ack.
        // Check if user is the one who sent the request.
        setAccepted(pendingAck ? STATUS.SENT : STATUS.RECEIVED);
      }
    }

    if (activeContact) {
      loadActiveContact();
    }
  }, [activeContact, profile.address]);

  const acceptRequest = () => {
    acceptOrReject({ from: profile.address, to: activeContact, accepted: true })
        .then(() => setAccepted(1));
  };

  const rejectRequest = () => {
    acceptOrReject({ from: profile.address, to: activeContact, accepted: false })
      .then(() => {
        // Delete this contact from setContacts;
        setContacts(_contacts => _contacts.filter(c => c !== activeContact));
        setActiveContact(null);
      });
  };

  if (accepted === STATUS.PENDING) {
    return (
      <Grid item sx={{ mt: -5, pr: 11.75 }}>
        <Skeleton />
      </Grid>
    );
  }

  if (accepted === STATUS.ACCEPTED) {
    return (
      <Grid
        item
        sx={{ mt: -10 }}
        style={{ position: 'relative', height: '100%' }}
      >
        <Chat sent={sent} />
      </Grid>
    )
  }

  return (
    <>
      <h2>Hi, {profile.name}!</h2>
      <h4 style={{ marginTop: '-15px' }}>
        <Tooltip arrow placement="bottom" title={activeContact}>
          <Button variant="text" color="info" size="large" sx={{ ml: '-10px' }}>
            <b style={{ fontSize: 21 }}>{activeContactProfile?.name}</b>
          </Button>
        </Tooltip>
        {STATUS_MESSAGE[accepted]}
      </h4>
      {accepted === STATUS.RECEIVED && (
        <Grid container spacing={3}>
          <Grid item xs="auto">
            <Button variant="contained" color="success" size="large" onClick={acceptRequest}>Accept</Button>
          </Grid>
          <Grid item xs="auto">
            <Button variant="outlined" color="error" size="large" onClick={rejectRequest}>Reject</Button>
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default ActiveContact;
