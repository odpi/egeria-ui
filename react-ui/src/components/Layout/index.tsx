import React from 'react';
import { Switch } from 'react-router-dom';
import { PrivateRoute } from '../../components/PrivateRoute';
import Home from '../Home';
import App from '../../App';

interface Props {
}

interface State {
}

class Layout extends React.Component<Props, State> {
  render() {
    return (
      <div className="layout">
        <Switch>
          <PrivateRoute exact path="/" component={Home} />
          <PrivateRoute path="/" component={App} />
        </Switch>
      </div>
    );
  }
}

export default Layout;
