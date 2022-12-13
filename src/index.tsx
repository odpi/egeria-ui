import ReactDOM from 'react-dom/client';

import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';

import reportWebVitals from './reportWebVitals';

import './index.scss';

import { EgeriaHome, links, EgeriaLogin, RequireAuth, EgeriaApp } from '@lfai/egeria-ui-core';
import { AppInstance } from './components/AppInstance';
import { goHome } from '@lfai/egeria-js-commons';
import { EgeriaAssetDetailsPrint, EgeriaLineageGraphPrint } from '@lfai/egeria-ui-components';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

console.log('process.env.REACT_APP_API_URL', process.env.REACT_APP_API_URL);
console.log('process.env.REACT_APP_ROOT_PATH', process.env.REACT_APP_ROOT_PATH);

root.render(
  <Router basename={process.env.REACT_APP_ROOT_PATH}>
    <Routes>
      <Route path="/" element={<EgeriaApp single={true} main={<EgeriaHome links={links} />} /> } />
      <Route path="/*" element={<AppInstance />} />

      <Route path={'/assets/:guid/details/print'}
             element={<EgeriaApp single={true}
                                 main={<RequireAuth><EgeriaAssetDetailsPrint /></RequireAuth>} />
                     } />

      <Route path={'/asset-lineage/:guid/:lineageType/print'}
             element={<EgeriaApp single={true}
                                 main={<RequireAuth><EgeriaLineageGraphPrint /></RequireAuth>} />
                     } />

      <Route path="/login" element={<EgeriaApp single={true} main={<EgeriaLogin loginCallback={ goHome } /> } /> } />
    </Routes>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
