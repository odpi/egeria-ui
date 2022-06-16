import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
// import reportWebVitals from './reportWebVitals';

import './index.scss';

// import SignIn from './components/Login/SignIn';
// import Layout from './components/Layout';
import App from './components/App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Router basename={process.env.REACT_APP_ROOT_PATH}>
      <Routes>
        <Route path="/" element={<App />} />
        {/* <Route path="/login" element={<SignIn />} /> */}
        {/* <Route path="/" element={<Layout />} /> */}
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
