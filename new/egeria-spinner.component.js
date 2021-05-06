/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { IronOverlayBehavior } from '@polymer/iron-overlay-behavior/iron-overlay-behavior.js';
import '@polymer/paper-spinner/paper-spinner-lite.js';

class EgeriaSpinner extends mixinBehaviors(IronOverlayBehavior, PolymerElement)  {
    static get template() {
      return html`
        <style>
          :host {
            /* display:block; */
            /* height:100%; */
            /* position:relative; */
            background: transparent;
          }

          paper-spinner-lite {
            position: absolute;
            left: 50%;
            top: 50%;
            margin-left: -40pt; /*(half of width)*/
            margin-top: -40pt;  /*(half of height)*/

            width: 80pt;
            height: 80pt;
          }
        </style>

        <paper-spinner-lite active></paper-spinner-lite>
    `;
    }
}

window.customElements.define('egeria-spinner', EgeriaSpinner);
