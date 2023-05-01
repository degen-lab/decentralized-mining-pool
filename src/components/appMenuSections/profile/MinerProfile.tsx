import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { readOnlyGetBalance } from '../../../consts/readOnly';
import { userSession } from '../../../redux/reducers/user-state';
import '../style.css';
import colors from '../../../consts/colorPallete';
import useCurrentTheme from '../../../consts/theme';
import { Box } from '@mui/material';

const MinerProfile = () => {
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const { currentTheme } = useCurrentTheme();

  useEffect(() => {
    const getUserBalance = async () => {
      const principalAddress = userSession.loadUserData().profile.stxAddress.testnet;

      const balance = await readOnlyGetBalance(principalAddress);
      setCurrentBalance(balance);
    };

    getUserBalance();
  }, []);

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 60px)', 
      backgroundColor: colors[currentTheme].accent2, 
      color: colors[currentTheme].secondary,
      marginTop: -2.5 }}>
      <div>
        <ul>
          <li>balance SC: {currentBalance}</li>
          <li>total withdrawal of SC</li>
          <li>autoexchange stx to btc: yes/no</li>
          <li>change btc address</li>
          <li>claim rewards for block (block_id)</li>
        </ul>

        <Button
          variant="contained"
          className="minerProfileButtons"
          onClick={() => {
            alert('we need to implement this functionality');
          }}
        >
          Withdraw
        </Button>

        <Button
          variant="contained"
          className="minerProfileButtons"
          onClick={() => {
            alert('we need to implement this functionality');
          }}
        >
          Deposit
        </Button>

        <Button
          variant="contained"
          className="minerProfileButtons"
          onClick={() => {
            alert('we need to implement this functionality');
          }}
        >
          Leave pool
        </Button>
      </div>
    </Box>
  );
};

export default MinerProfile;
