import MainPage from './MainPage';

import { Connect } from '@stacks/connect-react';
import { useAppSelector } from '../redux/store';

const Authenticate = () => {
  const userSession = useAppSelector((state) => state.userState.userSession);
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
