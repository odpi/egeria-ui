import ReactDOM from 'react-dom/client';

import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';

import reportWebVitals from './reportWebVitals';

import './index.scss';

import { EgeriaHome, links, EgeriaLogin } from 'egeria-ui-core';
import { AppInstance } from './components/AppInstance';
import { apiUrl, goHome } from 'egeria-js-commons';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

console.log('API_URL', process.env.REACT_APP_API_URL);

root.render(
  <Router basename={process.env.REACT_APP_ROOT_PATH}>
    <Routes>
      <Route path="/" element={<EgeriaHome links={links} />} />
      <Route path="/*" element={<AppInstance />} />
      <Route path="/login" element={<EgeriaLogin loginCallback={ goHome }
                                                 apiUrl={`${apiUrl()}/api/auth/login`} /> } />
    </Routes>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
