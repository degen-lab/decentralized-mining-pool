import Button from '@mui/material/Button';
import '../style.css';

const MinerProfile = () => {
  return (
    <div>
      <ul>
        <li>balance SC</li>
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
