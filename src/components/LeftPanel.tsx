import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/icons-material/MenuRounded';
import MenuOpen from '@mui/icons-material/MenuOpenRounded';
import HomeIcon from '@mui/icons-material/Home';
import Hardware from '@mui/icons-material/Hardware';
import Poll from '@mui/icons-material/Poll';
import Movie from '@mui/icons-material/Movie';
import { Link } from 'react-router-dom';
import colors from '../consts/colors';
import { MenuItem } from '@mui/material';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface ConnectWalletProps {
  currentTheme: string;
}

const LeftPanel = ({ currentTheme }: ConnectWalletProps) => {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250, height: '100%' }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
      style={{ backgroundColor: colors[currentTheme].accent2 }}
    >
      <List style={{ backgroundColor: colors[currentTheme].primary }}>
        <ListItem disablePadding>
          <div
            style={{
              width: 'auto',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 2,
              marginBottom: 2,
            }}
          >
            <ListItemButton>
              <MenuOpen fontSize="medium" style={{ color: colors[currentTheme].buttons }} />
            </ListItemButton>
          </div>
        </ListItem>
      </List>
      <Divider style={{ backgroundColor: colors[currentTheme].accent2 }} />
      <List style={{ backgroundColor: colors[currentTheme].accent2 }}>
        <div style={{ marginTop: -10 }}>
          <ListItem>
            <ListItemButton component={Link} to={'/'}>
              <ListItemIcon>
                <HomeIcon style={{ color: colors[currentTheme].secondary }} />
              </ListItemIcon>
              <ListItemText style={{ color: colors[currentTheme].secondary }} primary="Home" />
            </ListItemButton>
          </ListItem>
          <Divider style={{ backgroundColor: colors[currentTheme].secondary }} />
          <Divider style={{ backgroundColor: colors[currentTheme].secondary }} />
          <Divider style={{ backgroundColor: colors[currentTheme].secondary }} />
        </div>
        <div>
          <ListItem>
            <ListItemButton component={Link} to={'/mining-pool'}>
              <ListItemIcon>
                <Hardware style={{ color: colors[currentTheme].secondary }} />
              </ListItemIcon>
              <ListItemText style={{ color: colors[currentTheme].secondary }} primary="Mining Pool" />
            </ListItemButton>
          </ListItem>
          <Divider variant="middle" style={{ backgroundColor: colors[currentTheme].secondary }} />
        </div>
        <div>
          <ListItem>
            <ListItemButton component={Link} to={'/voting'}>
              <ListItemIcon>
                <Poll style={{ color: colors[currentTheme].secondary }} />
              </ListItemIcon>
              <ListItemText style={{ color: colors[currentTheme].secondary }} primary="Voting" />
            </ListItemButton>
          </ListItem>
          <Divider variant="middle" style={{ backgroundColor: colors[currentTheme].secondary }} />
        </div>
        <div>
          <ListItem>
            <ListItemButton component={Link} to={'/cinema'}>
              <ListItemIcon>
                <Movie style={{ color: colors[currentTheme].secondary }} />
              </ListItemIcon>
              <ListItemText style={{ color: colors[currentTheme].secondary }} primary="Cinema" />
            </ListItemButton>
          </ListItem>
        </div>
      </List>
    </Box>
  );

  return (
    <div>
      <React.Fragment key={'left'}>
        <Button onClick={toggleDrawer('left', true)} style={{ color: colors[currentTheme].buttons }}>
          <Menu fontSize="medium" />
        </Button>
        <Drawer anchor={'left'} open={state['left']} onClose={toggleDrawer('left', false)}>
          {list('left')}
        </Drawer>
      </React.Fragment>
    </div>
  );
};

export default LeftPanel;
