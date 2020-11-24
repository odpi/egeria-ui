/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class Forbidden403Page extends PolymerElement {
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

      Oops, it appears your access is forbidden on this page. <br>
      <a href="/#[[rootPath]]">Head back to home</a>.
    `;
  }
}

window.customElements.define('forbidden-403-page', Forbidden403Page);
