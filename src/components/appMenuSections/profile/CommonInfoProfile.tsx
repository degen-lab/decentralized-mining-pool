import { selectCurrentUserRole } from '../../../redux/reducers/user-state';
import { useAppSelector } from '../../../redux/store';
import colors from '../../../consts/colorPallete';
import useCurrentTheme from '../../../consts/theme';
import { Box } from '@mui/material';

const CommonInfoProfile = () => {
  const currentRole = useAppSelector(selectCurrentUserRole);
  const { currentTheme } = useCurrentTheme();
  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 60px)', 
      backgroundColor: colors[currentTheme].accent2, 
      color: colors[currentTheme].secondary,
      marginTop: -2.5 }}>
      <ul>
        <li>display connected wallet</li>
        <li>option to change wallet</li>
        <li>current role: {currentRole}</li>
        <li>link to explorer</li>
      </ul>
    </Box>
  );
};

export default CommonInfoProfile;
