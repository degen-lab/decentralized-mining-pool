import { selectCurrentUserRole, selectUserSessionState } from '../../../redux/reducers/user-state';
import { useAppSelector } from '../../../redux/store';
import colors from '../../../consts/colorPallete';
import useCurrentTheme from '../../../consts/theme';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { network, getExplorerUrl } from '../../../consts/network';

const CommonInfoProfile = () => {
  const currentRole = useAppSelector(selectCurrentUserRole);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [explorerLink, setExplorerLink] = useState<string | undefined>(undefined);
  const { currentTheme } = useCurrentTheme();
  const userSession = useAppSelector(selectUserSessionState);

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

  useEffect(() => {
    const wallet = userSession.loadUserData().profile.stxAddress.testnet;
    setConnectedWallet(wallet);
  }, [connectedWallet]);
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 60px)',
        backgroundColor: colors[currentTheme].accent2,
        color: colors[currentTheme].secondary,
        marginTop: -2.5,
      }}
    >
      <ul>
        <li>
          display connected wallet:
          {connectedWallet !== null && <div>{connectedWallet}</div>}
        </li>
        <li>option to change wallet: postponed by Suciu</li>
        <li>
          current role:
          <div>{currentRole === 'NormalUser' ? 'not asked to join yet' : currentRole}</div>
        </li>
        <li>
          <button style={{ backgroundColor: colors[currentTheme].accent2, color: colors[currentTheme].secondary }}>
            <a
              style={{ backgroundColor: colors[currentTheme].accent2, color: colors[currentTheme].secondary }}
              target="_blank"
              rel="noreferrer"
              href={explorerLink !== undefined ? explorerLink : ''}
            >
              link to explorer
            </a>
          </button>
        </li>
      </ul>
    </Box>
  );
};

export default CommonInfoProfile;
