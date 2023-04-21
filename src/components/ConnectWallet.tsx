import { AppConfig } from '@stacks/connect';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import colors from '../consts/Colors';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { connectAction, disconnectAction, getUserRoleAction } from '../redux/actions';
import { selectCurrentUserRole, selectUsereSessionState } from '../redux/reducers/user-state';

const appConfig = new AppConfig(['store_write', 'publish_data']);

interface ConnectWalletProps {
  currentTheme: string;
}

const ConnectWallet = ({ currentTheme }: ConnectWalletProps) => {
  const userSession = useAppSelector(selectUsereSessionState);
  const dispatch = useAppDispatch();

  const currentRole = useAppSelector(selectCurrentUserRole);

  const disconnect = () => {
    dispatch(disconnectAction());
  };

  const authenticate = async () => {
    dispatch(connectAction());
  };

  if (userSession.isUserSignedIn()) {
    if (currentRole === 'Viewer') {
      dispatch(getUserRoleAction());
      return <div>Loading role...</div>;
    }
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
