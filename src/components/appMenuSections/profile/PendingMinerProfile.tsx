import colors from '../../../consts/colorPallete';
import useCurrentTheme from '../../../consts/theme';
import { Box } from '@mui/material';

const PendingMinerProfile = () => {
  const { currentTheme } = useCurrentTheme();

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 60px)', 
      backgroundColor: colors[currentTheme].accent2, 
      color: colors[currentTheme].secondary,
      marginTop: -2.5 }}>
      <div>
        <ul>
          <li>status: pending</li>
          <li>can_pending_join</li>
          <li>block until you join pool</li>
        </ul>
      </div>
    </Box>
  );
};

export default PendingMinerProfile;
