import { useEffect } from 'react';
import {
  readOnlyGetAllDataMinersPendingAccept,
  readOnlyGetNotifierElectionProcessData,
} from '../../../consts/readOnly';
import { selectCurrentUserRole, UserRole } from '../../../redux/reducers/user-state';
import { useAppSelector } from '../../../redux/store';
import CommonInfoProfile from './CommonInfoProfile';
import MinerProfile from './MinerProfile';
import PendingMinerProfile from './PendingMinerProfile';
import WaitingMinerProfile from './WaitingMinerProfile';
import { ContractAskToJoin } from '../../../consts/smartContractFunctions';

const Profile = () => {
  const currentRole: UserRole = useAppSelector(selectCurrentUserRole);

  useEffect(() => {
    const testFunction = async () => {
      const test = await readOnlyGetAllDataMinersPendingAccept();
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
      <button onClick={() => ContractAskToJoin('ST2ST2H80NP5C9SPR4ENJ1Z9CDM9PKAJVPYWPQZ50')}>ask to join</button>
    </div>
  );
};

export default Profile;
