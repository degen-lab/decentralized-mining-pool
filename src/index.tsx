import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainPage from './components/MainPage';

import { Connect } from '@stacks/connect-react';
import { BrowserRouter } from 'react-router-dom';
import { userSession } from './components/ConnectWallet';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <BrowserRouter>
    <React.StrictMode>
      <Connect
        authOptions={{
          appDetails: {
            name: 'Stacks React Template',
            // todo:
            icon: window.location.origin + '/logo.png',
          },
          redirectTo: '/',
          onFinish: () => {
            window.location.reload();
          },
          userSession,
        }}
      >
        <MainPage />
      </Connect>
    </React.StrictMode>
  </BrowserRouter>
);
