import { AppConfig } from '@stacks/connect';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import colors from '../consts/Colors';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { connectAction, disconnectAction, getUserRoleAction } from '../redux/actions';
import { selectCurrentUserRole, selectUsereSessionState } from '../redux/reducers/user-state';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelect } from '@mui/base';

const appConfig = new AppConfig(['store_write', 'publish_data']);

type UserAloowedRoutes = 'normalUser' | 'pendingMiner' | 'miner' | 'viewer' | '/';

interface ConnectWalletProps {
  currentTheme: string;
}

const ConnectWallet = ({ currentTheme }: ConnectWalletProps) => {
  const [currentPathName, setCurrentPathName] = useState<string | UserAloowedRoutes>('');
  const userSession = useAppSelector(selectUsereSessionState);
  const dispatch = useAppDispatch();

  const currentRole = useAppSelector(selectCurrentUserRole);
  const location = useLocation();
  console.log(location);
  console.log('___', location.pathname.substring(1));
  const controlAccessRoutes = () => {
    setCurrentPathName(location.pathname);
    if (currentPathName !== '/') {
      if (currentPathName.substring(1).toLowerCase() !== currentRole.toLowerCase()) {
        return alert('Seems like you got lost, click here to go back to the main page');
        console.log('Seems like you got lost, click here to go back to the main page');
      }
    }
  };

  useEffect(() => {
    controlAccessRoutes();
  }, [location.pathname]);

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
