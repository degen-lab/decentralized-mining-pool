import { selectCurrentUserRole, UserRole } from '../../../redux/reducers/user-state';
import { useAppSelector } from '../../../redux/store';
import CommonInfoProfile from './CommonInfoProfile';
import MinerProfile from './MinerProfile';
import PendingMinerProfile from './PendingMinerProfile';
import WaitingMinerProfile from './WaitingMinerProfile';

const Profile = () => {
  const currentRole: UserRole = useAppSelector(selectCurrentUserRole);

  const profileMapping: Record<UserRole, React.ReactElement> = {
    Viewer: <CommonInfoProfile />,
    NormalUser: <CommonInfoProfile />,
    WaitingMiner: <WaitingMinerProfile />,
    PendingMiner: <PendingMinerProfile />,
    Miner: <MinerProfile />,
  };

  return (
    <div>
      <h2>Profile</h2>
      {profileMapping[currentRole]}
    </div>
  );
};

export default Profile;
