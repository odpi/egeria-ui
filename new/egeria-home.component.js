/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icon/iron-icon';
import '@polymer/paper-button/paper-button';
import '../old/shared-styles.js';

class EgeriaHome extends PolymerElement {
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

        .row {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
        }

        .content {
          margin:0 auto;
          padding:50px;
          width:40%;
          text-align:center;
          border: 2px solid var(--egeria-primary-color);
          border-radius: 5px;
        }

        .content img {
          height:50px;
          margin-left: 25px;
        }
      </style>

      <div class="content">
        <div class="row">
          <p>Powered by</p>

          <img src="/images/Logo_transparent.png"/>
        </div>

        <a href="/asset-catalog/search">
          <paper-button>Start</paper-button>
        </a>
      </div>
    `;
  }
}

window.customElements.define('egeria-home', EgeriaHome);
