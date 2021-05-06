/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-item/paper-item-body';
import '@polymer/paper-styles/paper-styles';
import '@polymer/paper-styles/color';
import '../old/shared-styles.js';

class EgeriaAbout extends PolymerElement {
  static get template() {
    return html`
       <style include="shared-styles">
        :host {
          display: block;
          height:100%;
          background-color: var(--egeria-background-color);
        }
      </style>

      <token-ajax id="about-request" last-response="{{ about }}" url="/about.json" auto></token-ajax>

      <div role="listbox">
        <paper-item>
          <paper-item-body two-line>
            <div>Application name</div>
            <div secondary>[[ about.name ]]</div>
          </paper-item-body>
        </paper-item>

        <paper-item>
          <paper-item-body two-line>
            <div>Version</div>
            <div secondary>[[ about.version ]]</div>
          </paper-item-body>
        </paper-item>

          <paper-item>
          <paper-item-body two-line>
            <div>Build time</div>
            <div secondary>[[ about.buildTime ]]</div>
          </paper-item-body>
        </paper-item>

        <paper-item>
          <paper-item-body two-line>
            <div>Commit ID</div>
            <div secondary>[[ about.commitId ]]</div>
          </paper-item-body>
        </paper-item>
      </div>
    `;
  }
}

window.customElements.define('egeria-about', EgeriaAbout);
