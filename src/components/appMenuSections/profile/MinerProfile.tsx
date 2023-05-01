import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { readOnlyGetBalance } from '../../../consts/readOnly';
import { userSession } from '../../../redux/reducers/user-state';
import '../style.css';

const MinerProfile = () => {
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  useEffect(() => {
    const getUserBalance = async () => {
      const principalAddress = userSession.loadUserData().profile.stxAddress.testnet;

      const balance = await readOnlyGetBalance(principalAddress);
      setCurrentBalance(balance);
    };

    getUserBalance();
  }, []);
  return (
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
  );
};

export default MinerProfile;
