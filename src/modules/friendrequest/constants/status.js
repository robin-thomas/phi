export const STATUS = {
  'PENDING': 'PENDING',
  'SENT': 'SENT',
  'REJECTED': 'REJECTED',
  'RECEIVED': 'RECEIVED',
  'ACCEPTED': 'ACCEPTED',
};

export const STATUS_MESSAGE = {
  [STATUS.SENT]: 'hasnt yet seen your chat request',
  [STATUS.REJECTED]: 'has rejected your chat request',
  [STATUS.RECEIVED]: 'has sent you a chat request',
};
