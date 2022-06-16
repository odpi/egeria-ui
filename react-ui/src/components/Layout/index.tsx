import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PrivateRoute } from '../../components/PrivateRoute';
import Home from '../Home';
import App from '../../App';

interface Props {
}

interface State {
}

/**
 *
 * React component used for handling the root routing mechanism.
 *
 * @since      0.1.0
 * @access     public
 *
 */
class Layout extends React.Component<Props, State> {
  render() {
    return (
      <div className="layout">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/" element={<App />} />

          {/* <PrivateRoute exact path="/" component={Home} /> */}
          {/* <PrivateRoute path="/" component={App} /> */}
        </Routes>
      </div>
    );
  }
}

export default Layout;
