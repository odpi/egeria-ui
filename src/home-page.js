/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class HomePage extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          margin: 10px 24px;
          padding: 5px;
          background-color:  var(--egeria-background-color);
          min-height: calc(100vh - 84px);
        }
      </style>
    `;
  }
}

window.customElements.define('home-page', HomePage);
