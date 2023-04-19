import { AppConfig, UserSession } from '@stacks/connect';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import colors from '../consts/Colors';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { connectAction, disconnectAction } from '../redux/actions';
import { selectUsereSessionState } from '../redux/reducers/user-state';

const appConfig = new AppConfig(['store_write', 'publish_data']);

// export const userSession = new UserSession({ appConfig });

interface ConnectWalletProps {
  currentTheme: string;
}

const ConnectWallet = ({ currentTheme }: ConnectWalletProps) => {
  const userSession = useAppSelector(selectUsereSessionState);
  const dispatch = useAppDispatch();

  const disconnect = () => {
    dispatch(disconnectAction());
  };

  const authenticate = () => {
    dispatch(connectAction());
  };

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
