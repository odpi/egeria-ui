/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icon/iron-icon';
import '../old/shared-styles.js';

class EgeriaErrorPage extends PolymerElement {
  static get properties() {
    return {
      statusCode: { type: Number, value: null },
      message: { type: String, value: '' }
    };
  }

  static get template() {
    return html`
       <style include="shared-styles">
        :host {
          display: block;
          height:100%;
          padding-top:50px;
          background-color: var(--egeria-background-color);
        }

        h1, h2 {
          margin:0 !important;
          padding: 0 !important;
        }

        .content {
          margin:0 auto;
          padding:50px;
          width:40%;
          text-align:center;
          border: 2px solid var(--egeria-primary-color);
          border-radius: 5px;
        }

        .bigger-icon {
          height:100px;
          width:100px;
        }
      </style>

      <div class="content">
        <iron-icon icon="icons:report" class="bigger-icon"></iron-icon>
        <h1>[[ statusCode ]]</h1>
        <h2>[[ message ]]</h2>
      </div>
    `;
  }
}

window.customElements.define('egeria-error-page', EgeriaErrorPage);
