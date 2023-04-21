import MainPage from './MainPage';

import { Connect } from '@stacks/connect-react';
import { useAppSelector } from '../redux/store';
import { selectUsereSessionState } from '../redux/reducers/user-state';

const Authenticate = () => {
  const userSession = useAppSelector(selectUsereSessionState);

  return (
    <Connect
      authOptions={{
        appDetails: {
          name: 'Stacks React Template',
          // todo:
          icon: window.location.origin + '/logo.png',
        },
        redirectTo: '/',
        onFinish: () => {
          window.location.reload();
        },
        userSession,
      }}
    >
      <MainPage />
    </Connect>
  );
};

export default Authenticate;
