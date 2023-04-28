import { selectCurrentUserRole } from '../../../redux/reducers/user-state';
import { useAppSelector } from '../../../redux/store';

const CommonInfoProfile = () => {
  const currentRole = useAppSelector(selectCurrentUserRole);
  return (
    <ul>
      <li>display connected wallet</li>
      <li>option to change wallet</li>
      <li>current role: {currentRole}</li>
      <li>link to explorer</li>
    </ul>
  );
};

export default CommonInfoProfile;
