import { AppConfig, UserSession } from '@stacks/connect';
import { IinitialState } from '.';

export interface IUserState {
  userSession: UserSession;
}

const appConfig = new AppConfig(['store_write', 'publish_data']);

export const userSession = new UserSession({ appConfig });

export const defaultUserState: IUserState = {
  userSession,
};

export const selectUserState = (state: IinitialState) => state.userState;
export const selectUsereSessionState = (state: IinitialState) => state.userState.userSession;
