import { IUserState, defaultUserState, selectUsereSessionState } from './user-state';
import { DISCONNECT_USER_SESSION, CONNECT_USER_SESSION } from '../actions';

import { showConnect } from '@stacks/connect';

export interface IinitialState {
  userState: IUserState;
}

const initialState: IinitialState = {
  userState: defaultUserState,
};

interface IreduxAction {
  type: string;
  payload?: any;
}

const mainReducer = (state = initialState, action: IreduxAction) => {
  const userSession = selectUsereSessionState(state);
  switch (action.type) {
    case CONNECT_USER_SESSION:
      showConnect({
        appDetails: {
          name: 'Stacks React Starter',
          icon: window.location.origin + '/logo512.png',
        },
        redirectTo: '/',
        onFinish: () => {
          window.location.reload();
        },
        userSession,
      });
      return state;
    case DISCONNECT_USER_SESSION:
      state.userState.userSession.signUserOut('/');
      console.log('Disconnect');
      return state;
    default:
      return state;
  }
};

export default mainReducer;
