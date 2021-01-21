/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-styles/paper-styles.js';
import '@polymer/paper-input/paper-input-behavior.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class UserOptions extends PolymerElement {


  static get properties() {
    return {
      user: {
        type: Object,
        notify: true
      }
    };
  }

  _logout() {
    this.$.userAjax.url = "/api/logout";
    this.$.userAjax._go();
    var customEvent = new CustomEvent('logout', {
      bubbles: true,
      composed: true,
      detail: { greeted: "Bye!" }
    });
    this.dispatchEvent(customEvent);
  }

  static get template() {
    return html`
      <style>
        .avatar {
          height: 40px;
          width: 40px;
          border-radius: 20px;
          box-sizing: border-box;
          background-color: #DDD;
        }

        paper-item a {
          text-decoration: none;
          color: var(--egeria-secondary-color);
        }

        paper-button {
          text-transform: none;
        }
      </style>
      <token-ajax id="userAjax" last-response="{{user}}" url="/api/users/current" auto></token-ajax>

      <div style="float: right">
        <paper-menu-button horizontal-align="right"
                           horizontal-offset="20"
                horizontal-offset="20"
                           horizontal-offset="20"
                           horizontal-align="bottom"
                           vertical-offset="65"
                vertical-offset="65"
                           vertical-offset="65"
                           style="margin-top: 10px">
            <paper-icon-item slot="dropdown-trigger">
              <div class="avatar" slot="item-icon">
                <img src="./images/user.svg" height="100%"/>
              </div>
            </paper-icon-item>

            <div slot="dropdown-content"vstyle="display: block">
            <paper-listbox style="min-width: 200px">
                <paper-item>Signed in as:<br> [[user.username]]</paper-item>
                <hr>
                <paper-item>Roles: [[user.roles]]</paper-item>
                <hr>
                <paper-item>Settings</paper-item>
                <paper-item>Help</paper-item>
                <paper-item><a href="[[rootPath]]#/about">About</a></paper-item>
                <hr>
            </paper-listbox>
            <paper-item>
              <a href="[[rootPath]]" on-click="_logout" style="flex: auto">
              Sign out
              <iron-icon  icon="exit-to-app" style="float: right"></iron-icon>
              </a>
            </paper-item>
            </div>

        </paper-menu-button>
      </div>

    `;
  }
}

window.customElements.define('user-options', UserOptions);
