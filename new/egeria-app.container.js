/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

/* Commons */
import '../src/token-ajax';
import '@polymer/iron-localstorage/iron-localstorage';
import '@vaadin/vaadin-icons/vaadin-icons.js';
import '@polymer/iron-icons/iron-icons.js';

// import { routes } from './routes';
// import { getCookie } from './common/cookies';
// import './my-app';

import './egeria-single-page.component';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(false);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath('/');

import { egeriaFetch } from './commons/fetch';

class EgeriaApp extends PolymerElement {
  static get properties() {
    return {
      components: { type: Array, value: null },
      currentUser: { type: Object, value: {} },
      appInfo: { type: Object, value: {} },
      roles: { type: Array, value: [] },

      isLoading: { type: Boolean, value: true },
      isLoggedIn: { type: Boolean, value: false }
    };
  }

  ready() {
    super.ready();

    Promise.all([
      egeriaFetch(`/api/public/app/info`).then(response => response.json()),
      egeriaFetch(`/api/users/components`).then(response => response.json()),
      egeriaFetch(`/api/users/current`).then(response => response.json()),
      egeriaFetch(`/api/users/roles`).then(response => response.json())
    ]).then((responses) => {
      let [ appInfo, components, currentUser, roles ] = responses;

      this.components = components.status === 403 ? [] : components;
      this.currentUser = currentUser.status === 403 ? {} : currentUser;
      this.roles = roles.status === 403 ? [] : roles;
      this.appInfo = appInfo.status === 403 ? {} : appInfo;

      this.isLoggedIn = currentUser.status === 200;

      this.isLoading = false;
    });
  }


  static get template() {
    return html`
      <style>
        :host {
          display:block;
          height:100%;
        }
      </style>

      <template is="dom-if" if="[[ !isLoading ]]" restamp="true">
        <egeria-single-page components="[[ components ]]"
                            current-user="[[ currentUser ]]"
                            roles="[[ roles ]]"
                            app-info="[[ appInfo ]]"
                            is-logged-in="[[ isLoggedIn ]]"></egeria-single-page>
      </template>

      <template is="dom-if" if="[[ isLoading ]]" restamp="true">
        <div class="is-loading">
          Loading...
        </div>
      </template>
    `;
  }
}

window.customElements.define('egeria-app', EgeriaApp);
