import '../App.css';
import HeaderBar from './HeaderBar';
import { Routes, Route } from 'react-router-dom';
import MiningPool from '../pages/MiningPool';
import Voting from '../pages/Voting';
import Cinema from '../pages/Cinema';

const MainPage = () => {
  return (
    <div>
      <div>
        <HeaderBar />
      </div>
      <Routes>
        <Route path="/">
          <Route index element={<MiningPool />} />
          <Route path="voting" element={<Voting />} />
          <Route path="cinema" element={<Cinema />} />
        </Route>
      </Routes>
    </div>
  );
};

export default MainPage;
