import { selectCurrentUserRole, UserRole } from '../../../redux/reducers/user-state';
import { useAppSelector } from '../../../redux/store';
import CommonInfoProfile from './CommonInfoProfile';
import MinerProfile from './MinerProfile';
import PendingMinerProfile from './PendingMinerProfile';
import WaitingMinerProfile from './WaitingMinerProfile';

const Profile = () => {
  const currentRole: UserRole = useAppSelector(selectCurrentUserRole);
  return (
    <div>
      <h2>Profile</h2>
      {currentRole !== 'Miner' && <CommonInfoProfile />}
      {currentRole === 'WaitingMiner' && <WaitingMinerProfile />}
      {currentRole === 'PendingMiner' && <PendingMinerProfile />}
      {currentRole === 'Miner' && <MinerProfile />}
    </div>
  );
};

export default Profile;
