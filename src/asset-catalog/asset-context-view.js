/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */
import { PolymerElement, html } from '@polymer/polymer';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';

import '../shared-styles.js';
import '../common/props-table';
import {ItemUtilsBehavior} from "../common/item-utils";

class AssetContextView extends mixinBehaviors([ItemUtilsBehavior], PolymerElement) {
    static get template() {
        return html`
      <style include="shared-styles">
       :host {
          display: flex;
          flex-flow: column;
          margin:var(--egeria-view-margin);
          min-height: var(--egeria-view-min-height);
        }
      </style>

      
      <dom-if if="[[item]]" restamp> 
        <template> 
        </template>
      </dom-if>
    `;
    }

}

window.customElements.define('asset-context-view', AssetContextView);