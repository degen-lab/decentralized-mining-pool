import { AppConfig, UserSession } from '@stacks/connect';

export interface IUserState {
  userSession: UserSession;
}

const appConfig = new AppConfig(['store_write', 'publish_data']);

export const userSession = new UserSession({ appConfig });

export const defaultUserState: IUserState = {
  userSession,
};
