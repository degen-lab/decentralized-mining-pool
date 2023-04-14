import { AppConfig, showConnect, UserSession } from '@stacks/connect';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import colors from '../consts/Colors';

const appConfig = new AppConfig(['store_write', 'publish_data']);

export const userSession = new UserSession({ appConfig });

const authenticate = () => {
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
};

const disconnect = () => {
  userSession.signUserOut('/');
};

interface ConnectWalletProps {
  currentTheme: string;
}

const ConnectWallet = ({ currentTheme }: ConnectWalletProps) => {
  if (userSession.isUserSignedIn()) {
    return (
      <div>
        <button className="Connect" style={{ backgroundColor: colors[currentTheme].primary }} onClick={disconnect}>
          <LogoutIcon style={{ color: colors[currentTheme].buttons }} fontSize="medium" />
        </button>
      </div>
    );
  }

  return (
    <button className="Connect" style={{ backgroundColor: colors[currentTheme].primary }} onClick={authenticate}>
      <LoginIcon style={{ color: colors[currentTheme].buttons }} fontSize="medium" />
    </button>
  );
};

export default ConnectWallet;
