import { selectCurrentUserRole, selectUserSessionState, UserRole } from '../../../redux/reducers/user-state';
import { useAppSelector } from '../../../redux/store';
import CommonInfoProfile from './CommonInfoProfile';
import MinerProfile from './MinerProfile';
import PendingMinerProfile from './PendingMinerProfile';
import WaitingMinerProfile from './WaitingMinerProfile';
import colors from '../../../consts/colorPallete';
import useCurrentTheme from '../../../consts/theme';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { network, getExplorerUrl } from '../../../consts/network';

const Profile = () => {
  const currentRole: UserRole = useAppSelector(selectCurrentUserRole);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [explorerLink, setExplorerLink] = useState<string | undefined>(undefined);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const userSession = useAppSelector(selectUserSessionState);
  const { currentTheme } = useCurrentTheme();

  const profileMapping: Record<UserRole, React.ReactElement> = {
    Viewer: <CommonInfoProfile />,
    NormalUser: <CommonInfoProfile />,
    Waiting: <WaitingMinerProfile />,
    Pending: <PendingMinerProfile />,
    Miner: <MinerProfile connectedWallet={connectedWallet} explorerLink={explorerLink} />,
  };

  useEffect(() => {
    const wallet = userSession.loadUserData().profile.stxAddress.testnet;
    setConnectedWallet(wallet);
  }, [connectedWallet]);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const args = userSession.loadUserData().profile.stxAddress.testnet;
      console.log('address', args);
      setUserAddress(args);
    } else {
      console.log('not signed in');
    }
  }, [userAddress]);

  useEffect(() => {
    if (userAddress !== null) {
      setExplorerLink(getExplorerUrl[network](userAddress).explorerUrl);
    }
  }, [explorerLink, userAddress]);

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 60px)',
        backgroundColor: colors[currentTheme].accent2,
        color: colors[currentTheme].secondary,
        marginTop: -2.5,
      }}
    >
      <div>
        <h2>Profile</h2>
        {profileMapping[currentRole]}
      </div>
    </Box>
  );
};

export default Profile;
