/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class EgeriaErrorHandling extends PolymerElement {
  static get properties() {
    return {
      errors: {
        type: Array,
        value: [],
        observer: '_onErrorsUpdate'
      }
    };
  }

  ready() {
    super.ready();
    let self = this;

    window.addEventListener('egeria-throw-message', e => {
      if(e && e.detail && self.errors.length < 10) {
        self.errors = [
          ...self.errors,
          e.detail
        ];
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    window.removeEventListener('egeria-throw-message', (e) => {
        console.log(e);
      }
    );
  }

  _onErrorsUpdate() {
    // console.log(this.errors);
    // debugger;
    // this.errors.length > 0 && this.$.div.colors ? this.$.div.colors.open() : {};
  }

  checkErrorsListSize(errors) {
    return errors.length > 0;
  }

  ack() {
    let modal = this.shadowRoot.querySelector('#colors');

    modal.close();
    this.errors = [];

    window.location.href='/';
  }

  back() {
    let modal = this.shadowRoot.querySelector('#colors');

    modal.close();
    this.errors = [];

    window.history.back();
  }

  static get template() {
    return html`
      <style>
        paper-dialog.colored {
          border: 2px solid;
          border-color: #af4c50;
          background-color: #f8f1e9;
          color: #af4c50;
        }

        paper-dialog.size-position {
          position: fixed;
          top: 16px;
          right: 16px;
          width: 300px;
          height: 300px;
          overflow: auto;
        }

        .content {
          padding-left:50px;
          padding-right:50px;
        }

        .content h3 {
          margin-top: 0px;
        }

        paper-button {
          background: #af4c50;
          color: #ffffff;
        }
      </style>

      <template is="dom-if" if="[[ checkErrorsListSize(errors) ]]">
        <paper-dialog id="colors" class="colored" opened modal >
          <div class="content">
            <h3>Something went wrong...</h3>
            <ul>
              <dom-repeat items="[[ errors ]]">
                <template>
                  <li>[[ item ]]</li>
                </template>
              </dom-repeat>
            </ul>

            <paper-button raised on-click="ack">Homepage</paper-button>
            <paper-button raised on-click="back">Get back</paper-button>
          </div>
        </paper-dialog>
      </template>
    `;
  }
}

window.customElements.define('egeria-error-handling', EgeriaErrorHandling);
