import colors from '../../../consts/colorPallete';
import useCurrentTheme from '../../../consts/theme';
import { Box } from '@mui/material';

const WaitingMinerProfile = () => {
  const { currentTheme } = useCurrentTheme()
  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 60px)', 
      backgroundColor: colors[currentTheme].accent2, 
      color: colors[currentTheme].secondary,
      marginTop: -2.5 }}>
      <div>
        <ul>
          <li>status: waiting</li>
          <li>positive votes for me</li>
          <li>negative votes for me</li>
        </ul>
      </div>
    </Box>
  );
};

export default WaitingMinerProfile;
