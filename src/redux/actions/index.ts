export const DISCONNECT_USER_SESSION = 'DISCONNECT_USER_SESSION';
export const CONNECT_USER_SESSION = 'CONNECT_USER_SESSION';

export const disconnectAction = () => {
  return { type: DISCONNECT_USER_SESSION };
};

export const connectAction = () => {
  return { type: CONNECT_USER_SESSION };
};
