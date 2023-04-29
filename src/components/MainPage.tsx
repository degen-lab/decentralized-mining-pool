import '../App.css';
import HeaderBar from './HeaderBar';
import { Routes, Route, Navigate } from 'react-router-dom';
import MiningPool from './appMenuSections/miningPool/MiningPool';
import Voting from './appMenuSections/voting/Voting';
import Home from '../pages/Home';
import Dashboard from './appMenuSections/dashboard/Dashboard';
import Profile from './appMenuSections/profile/Profile';
import MiningPoolDashboard from './appMenuSections/miningPool/MiningPoolDashboard';
import MiningPoolStatus from './appMenuSections/miningPool/MiningPoolStatus';
import VotingJoiners from './appMenuSections/voting/VotingJoiners';
import VotingRemovals from './appMenuSections/voting/VotingRemovals';
import VotingNotifier from './appMenuSections/voting/VotingNotifier';

const MainPage = () => {
  return (
    <div>
      <div>
        <HeaderBar />
      </div>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" index element={<Dashboard />} />
        <Route path="/miningPool/miners" element={<MiningPool />} />
        <Route path="/voting" element={<Voting />} />
        <Route path="/myProfile" element={<Profile />} />
        <Route path="/miningPool" element={<MiningPoolDashboard />} />
        <Route path="/miningPool/status" element={<MiningPoolStatus />} />
        <Route path="/voting/joiners" element={<VotingJoiners />} />
        <Route path="/voting/removals" element={<VotingRemovals />} />
        <Route path="/voting/notifier" element={<VotingNotifier />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
};

export default MainPage;
