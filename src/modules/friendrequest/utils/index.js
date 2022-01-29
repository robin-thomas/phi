import Ack from './textile/ack';
import Invite from './textile/invite';

export const acceptOrReject = async ({ from, to, accepted }) => {
  const fn = accepted ? 'accept' : 'reject';
  const message = `Are you sure you want to ${fn}?`;

  if (window.confirm(message)) {
    await Ack.post(from, to, accepted);
  } else {
    throw new Error('Cancelled');
  }
}

export const getAck = (from, to) => Ack.get(from, to);
export const getInvite = (from, to) => Invite.get(from, to);
export const getAllInvites = Invite.getAll;

export const loadFriendRequests = async (address) => await Promise.all([Invite.loadInvites(address), Ack.loadAcks(address) ]);

export { Ack };
export { Invite };
