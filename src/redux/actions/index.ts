import { IinitialState } from '../reducers';
import { UserRole } from '../reducers/user-state';
import { AppDispatch } from '../store';

export const DISCONNECT_USER_SESSION = 'DISCONNECT_USER_SESSION';
export const CONNECT_USER_SESSION = 'CONNECT_USER_SESSION';
export const UPDATE_USER_ROLE = 'UPDATE_USER_ROLE';

export const disconnectAction = () => {
  return { type: DISCONNECT_USER_SESSION };
};

export const connectAction = () => {
  return { type: CONNECT_USER_SESSION };
};

export const updateUserRoleAction = (newRole: string) => {
  return { type: UPDATE_USER_ROLE, payload: newRole };
};

const updateRole = (): Promise<UserRole> => {
  return Promise.resolve('Miner');
};

export const getUserRoleAction = () => {
  return async (dispatch: AppDispatch, getState: () => IinitialState) => {
    try {
      const userRole = await updateRole();
      dispatch(updateUserRoleAction(userRole));
    } catch (err) {
      console.error('Failed to grab user role');
    }
  };
};
