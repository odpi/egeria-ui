import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.scss';
import About from './components/About';
import UserInfo from './components/UserInfo';

import '@vaadin/vaadin-app-layout/vaadin-app-layout.js';
import '@vaadin/vaadin-app-layout/vaadin-drawer-toggle.js';
import '@vaadin/vaadin-tabs/vaadin-tabs.js';
import '@vaadin/vaadin-tabs/vaadin-tab.js';
import '@polymer/iron-icon/iron-icon.js';
import '@vaadin/vaadin-lumo-styles/icons.js';
import '@polymer/iron-icons/iron-icons.js';

import './components/About/lit';

import { PrivateRoute } from './components/PrivateRoute';
import AssetDetails from './components/Assets/Details';
import { authenticationService } from './services/authentication.service';
import AssetCatalog from './components/Assets/Catalog';

/*
 * By using typescript all elements must have a type declaration and since
 * imported components are javascript we need to declare this
 */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'vaadin-app-layout': any;
      'vaadin-drawer-toggle': any;
      'vaadin-tabs': any;
      'vaadin-tab': any;
      'iron-icon': any;
      'egeria-about-lit': any;
      'bx-data-table': any;
      'bx-table': any;
      'bx-table-head': any;
      'bx-table-header-row': any;
      'bx-table-header-cell': any;
      'bx-table-body': any;
      'bx-table-row': any;
      'bx-table-cell': any;
      'bx-breadcrumb': any;
      'bx-breadcrumb-item': any;
      'bx-breadcrumb-link': any;
      'multiselect-combo-box': any;
      'vaadin-text-field': any;
      'vaadin-button': any;
      'vaadin-grid': any;
      'vaadin-grid-column': any;
      'vaadin-grid-sorter': any;
      'vaadin-grid-filter': any;
      'vaadin-grid-sort-column': any;
      'vaadin-grid-filter-column': any;
      'vaadin-checkbox': any;
    }
  }
}

interface Props {
}

interface State {
  user: any;
}

/**
 *
 * App main layout used for displaying left menu and right content placeholder
 * used for different pages.
 *
 * @since      0.1.0
 * @access     public
 *
 */
class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      user: null
    };
  }
  componentDidMount() {
    authenticationService.currentUser.subscribe((user: any) => {
      if(user) {
        const userData = JSON.parse(user.sub);

        this.setState({
          user: userData
        });
      } else {
        user = null;
      }
    });
  }

  logout() {
    authenticationService.logout();
  }

  render() {
    const { user } = this.state;

    return (
      <div className="App">
        <vaadin-app-layout>
          <vaadin-drawer-toggle slot="navbar touch-optimized"></vaadin-drawer-toggle>
          <h3 slot="navbar touch-optimized">Egeria UI</h3>

          <div slot="navbar" className="pull-right mr15 fsize13">
            <UserInfo />
          </div>

          <vaadin-tabs orientation="vertical" slot="drawer" selected="-1">
            <vaadin-tab>
              <a href={`${process.env.REACT_APP_ROOT_PATH}`}>
                <iron-icon icon="icons:home"></iron-icon>
                Home
              </a>
            </vaadin-tab>
            <vaadin-tab>
              <a href={`${process.env.REACT_APP_ROOT_PATH}/about`}>
                <iron-icon icon="lumo:cog"></iron-icon>
                About
              </a>
            </vaadin-tab>
            <vaadin-tab>
              <a href={`${process.env.REACT_APP_ROOT_PATH}/assets/catalog`}>
                <iron-icon icon="lumo:cog"></iron-icon>
                Catalog
              </a>
            </vaadin-tab>
            { user && <vaadin-tab>
                <a href={process.env.REACT_APP_ROOT_PATH} onClick={ () => this.logout() }>
                  <iron-icon icon="lumo:user"></iron-icon>
                  Logout
                </a>
              </vaadin-tab> }
          </vaadin-tabs>

          <div className="content-container">
            <Switch>
              <Route exact path={'/'}>
                <div className="center">
                  {/* <img src={logo} height="200px" alt="Egeria Logo"/> */}
                </div>
              </Route>

              <PrivateRoute exact path="/about" component={About} />

              <PrivateRoute exact path="/assets/:uuid/details" component={AssetDetails} />

              <PrivateRoute exact path="/assets/catalog" component={AssetCatalog} />

              <Route path={`/about-lit`}>
                <egeria-about-lit></egeria-about-lit>
              </Route>
            </Switch>
          </div>
        </vaadin-app-layout>
      </div>
    );
  }
}

export default App;
