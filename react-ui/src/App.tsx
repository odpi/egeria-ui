import React from 'react';
import logo from './egeria-logo.png';
import { Route, Switch } from 'react-router-dom';
import './App.scss';
import About from './components/About';

import '@vaadin/vaadin-app-layout/vaadin-app-layout.js';
import '@vaadin/vaadin-app-layout/vaadin-drawer-toggle.js';
import '@vaadin/vaadin-tabs/vaadin-tabs.js';
import '@vaadin/vaadin-tabs/vaadin-tab.js';
import '@polymer/iron-icon/iron-icon.js';
import '@vaadin/vaadin-lumo-styles/icons.js';
import '@polymer/iron-icons/iron-icons.js';

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
    }
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <vaadin-app-layout>
          <vaadin-drawer-toggle slot="navbar touch-optimized"></vaadin-drawer-toggle>
          <h3 slot="navbar touch-optimized">Egeria UI</h3>

          <vaadin-tabs orientation="vertical" slot="drawer" selected="-1">
            <vaadin-tab>
              <a href="/react-ui/">
                <iron-icon icon="icons:home"></iron-icon>
                Home
              </a>
            </vaadin-tab>
            <vaadin-tab>
              <a href="/react-ui/about">
                <iron-icon icon="lumo:user"></iron-icon>
                About
              </a>
            </vaadin-tab>
            <vaadin-tab>
              <a href="/react-ui/contact">
                <iron-icon icon="lumo:phone"></iron-icon>
                Contact
              </a>
            </vaadin-tab>
          </vaadin-tabs>

          <div>
            <Switch>
              <Route exact path={'/'}>
                <img src={logo} height="200px" alt="Egeria Logo"/>
              </Route>
              <Route path={`/about`}>
                <About/>
              </Route>
              <Route path={`/contact`}>
                <h3>Contact</h3>
              </Route>
            </Switch>
          </div>
        </vaadin-app-layout>
      </div>
    );
  }
}

export default App;
