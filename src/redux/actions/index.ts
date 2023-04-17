import { AppDispatch } from '../store';
import { showConnect } from '@stacks/connect';

export const DISCONNECT_USER_SESSION = 'DISCONNECT_USER_SESSION';
export const CONNECT_USER_SESSION = 'CONNECT_USER_SESSION';

export const disconnectAction = () => {
  return { type: DISCONNECT_USER_SESSION };
};

export const connectAction = () => {
  return { type: CONNECT_USER_SESSION };

  // return async (dispatch: AppDispatch, getState: any) => {
  //   const state = getState();
  //   const userSession = state.userState.userSession;
  //   showConnect({
  //     appDetails: {
  //       name: 'Stacks React Starter',
  //       icon: window.location.origin + '/logo512.png',
  //     },
  //     redirectTo: '/',
  //     onFinish: () => {
  //       window.location.reload();
  //     },
  //     userSession,
  //   });
  //   dispatch({ type: CONNECT_USER_SESSION });
  // };
};
