/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

/* Commons */
import '@polymer/iron-localstorage/iron-localstorage';
import '@vaadin/vaadin-icons/vaadin-icons.js';
import '@polymer/iron-icons/iron-icons.js';

import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';

import './egeria-error-handling.component';
import './egeria-single-page.component';
import './egeria-error-page.component';
import './egeria-home.component';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(false);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath('/');

import { routes, routeCheck } from './routes';
import { getCookie } from './commons/local-storage';
import { egeriaFetch } from './commons/fetch';

class EgeriaApp extends PolymerElement {
  constructor() {
    super();

    let path = window.location.pathname.substr(1);

    if( !['login', 'forbidden', 'error', 'empty'].includes(path) ) {
      //except for the pages not using the this data
      //especially login is not need this calls
      this._getCurrentUser();
    }
  }

  static get properties() {
    return {
      components: { type: Array, value: [] },
      currentUser: { type: Object, value: {} },
      appInfo: { type: Object, value: {} },
      roles: { type: Array, value: [] },

      isLoggedIn: { type: Boolean, value: false },

      queryParams: {},
      routeData: {},
      tail: {},

      route: { type: Object },
      pages: { type: Array, value: [''], observer: '_pagesChanged' },
      page: { type: String, value: '' }
    };
  }

  static get observers() {
    return [
      '_routeCycle(route, components, currentUser)'
    ];
  }

  /**
   * process token
   * @private
   */
  _getCurrentUser() {

      const jwtClaims = this._parseJwtClaims();
      if ( jwtClaims ) {
        let tokenUser = JSON.parse(jwtClaims.sub);
        if (tokenUser) {

          this.currentUser = tokenUser;
          this.components = tokenUser.visibleComponents;
          this.roles = tokenUser.roles;

          this.isLoggedIn = this.currentUser !== null;
        }
      }
  }

  _parseJwtClaims () {
    const token = getCookie('token');
    if(token !== undefined && token !== null){
      const base64User = token.split('.')[1];
      if( base64User !== undefined ) {
        return JSON.parse( atob( base64User ) );
      }
    }
  };

  _pagesChanged(newPages) {
    if(newPages && newPages.length >= 0) {
      const [removed, ...newArr] = this.pages;

      this.page = removed;

      this.updatePageTitle(this.page, this.pages);
    }
  }

  _isEqualTo(a, b) {
    return a === b;
  }


  _doesntInclude(value) {
    return !['login', 'forbidden', 'error', 'homepage', 'empty'].includes(value);
  }

  canAccess(route, components) {
    // Added this so that i dont add
    // asset-catalog-search role on the backend
    let routeArray = route.split('/');
    let firstRoute = routeArray[0];

    return components.includes('*')
        || (routes.filter(r => components.includes(r.name))).map(r => r.name).includes(firstRoute);
  }

  updatePageTitle(page, pages) {
    document.title = `Egeria UI ${page ? `- ${pages.join(' - ')}`: ''}`;
  }

  redirectToLogin(route) {
    let queryParamsAsString = window.location.search;

    let encodedPath = `/login?redirect=${encodeURIComponent(`/${route}${queryParamsAsString ? `${queryParamsAsString}` : ``}`)}`;

    window.location.href = encodedPath;
  }

  _routeCycle(newRoute, components, currentUser) {
    if(newRoute && components && Array.isArray(components)) {
      let route = newRoute.path.replace(/^\/|\/$/g, '');

      switch(route) {
        case '':
          this.pages = ['homepage'];
          break;
        case 'login':
          this.pages = route.split('/');

          break;
        default:
          if(!routeCheck(route)) {
            this.pages = ['error'];

          } else if (!getCookie('token') && !['login'].includes(route)) {
            this.redirectToLogin(route);
          } else if(!currentUser) {
            this.redirectToLogin(route);
          } else {
            if(this.canAccess(route, components)) {
              this.pages = route.split('/');
            } else {
              this.pages = !getCookie('token') ? ['empty'] : ['forbidden'];
            }
          }
          break;
      }
    }
  }

  static get template() {
    return html`
      <style>
        :host {
          display:block;
          height:100vh;
        }
      </style>

      <app-location route="{{ route }}"
                    query-params="{{ queryParams }}"></app-location>

      <app-route route="{{ route }}"
                 pattern="/:page"
                 data="{{ routeData }}"
                 tail="{{ tail }}"></app-route>

        <template is="dom-if" if="[[ _isEqualTo(page, 'login') ]]">
          <egeria-login query-params="[[ queryParams ]]"></egeria-login>
        </template>

        <template is="dom-if" if="[[ _isEqualTo(page, 'error') ]]" >
          <egeria-error-page status-code="404" message="Page not found"></egeria-error-page>
        </template>

        <template is="dom-if" if="[[ _isEqualTo(page, 'forbidden') ]]" >
          <egeria-error-page status-code="403" message="Forbidden"></egeria-error-page>
        </template>

        <template is="dom-if" if="[[ _isEqualTo(page, 'homepage') ]]">
          <egeria-home 
                       components="[[ components ]]"></egeria-home>
        </template>

        <template is="dom-if" if="[[ _doesntInclude(page) ]]">
          <egeria-single-page components="[[ components ]]"
                              current-user="[[ currentUser ]]"
                              roles="[[ roles ]]"
                              app-info="[[ appInfo ]]"
                              is-logged-in="[[ isLoggedIn ]]"
                              pages="[[ pages ]]"></egeria-single-page>
        </template>

      <egeria-error-handling></egeria-error-handling>
    `;
  }
}

window.customElements.define('egeria-app', EgeriaApp);
