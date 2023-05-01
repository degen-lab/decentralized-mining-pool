import { useEffect } from 'react';
import { readOnlyGetBalance, readOnlyGetNotifierElectionProcessData } from '../../../consts/readOnly';
import { selectCurrentUserRole, UserRole, userSession } from '../../../redux/reducers/user-state';
import { useAppSelector } from '../../../redux/store';
import CommonInfoProfile from './CommonInfoProfile';
import MinerProfile from './MinerProfile';
import PendingMinerProfile from './PendingMinerProfile';
import WaitingMinerProfile from './WaitingMinerProfile';

const Profile = () => {
  const currentRole: UserRole = useAppSelector(selectCurrentUserRole);

  useEffect(() => {
    const testFunction = async () => {
      const test = await readOnlyGetNotifierElectionProcessData();
      console.log('notifier test', test);
    };
    testFunction();
  }, []);

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
