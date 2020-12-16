/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */
import {PolymerElement, html} from '@polymer/polymer';

import '../shared-styles.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-item/paper-item-body.js';
import '@polymer/paper-styles/paper-styles.js';
import '@vaadin/vaadin-icons/vaadin-icons.js';
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {RoleComponentsBehavior} from "../common/role-components";

class AssetTools extends mixinBehaviors([RoleComponentsBehavior], PolymerElement) {
    static get template() {
        return html`
  
      <style include="shared-styles">
        :host {
          display: block;
          padding: 10px 24px;
        }
        
        iron-icon {
         --iron-icon-fill-color: var(--egeria-button-ink-color);
        }
        paper-button {
          --paper-button-ink-color: var(--egeria-button-ink-color);
        }
        paper-button:hover {
          filter: brightness(110%);
        }
       ul#menu {
            margin: 0;
            padding: 0;
        }
      </style>
      <iron-localstorage name="user-components" value="{{components}}"></iron-localstorage>

      <token-ajax id="tokenAjaxSettings" last-response="{{omas}}" url="/api/ui/settings" auto></token-ajax>
      <template is="dom-if" if="[[components]]">
        <ul id="menu">
        <template is="dom-if" if="[[_hasComponent('ultimate-source')]]">
            <li> 
                <a on-click="_buttonClick" href="#/asset-lineage/ultimateSource/[[guid]]" title="Ultimate Source Lineage">
                    <paper-button raised>
                    <iron-icon icon="vaadin:connect-o" style="transform: rotate(180deg)"></iron-icon>
                    <div>&nbsp;Source</div>
                    </paper-button>
                </a>
            </li>
            </template>
            <template is="dom-if" if="[[_hasComponent('end-to-end')]]">
            <li> 
                <a on-click="_buttonClick" href="#/asset-lineage/endToEnd/[[guid]]" title="End2End Lineage">
                    <paper-button raised>
                    <iron-icon icon="vaadin:cluster"></iron-icon>
                    <div>&nbsp;End2End</div>
                    </paper-button>
                </a>
            </li>
            </template>
            <template is="dom-if" if="[[_hasComponent('ultimate-destination')]]">
            <li> 
                <a on-click="_buttonClick" href="#/asset-lineage/ultimateDestination/[[guid]]" title="Ultimate Destination Lineage"> 
                    <paper-button raised>
                    <iron-icon icon="vaadin:connect-o"></iron-icon>
                    <div>&nbsp;Dest</div>
                    </paper-button>
                </a>
            </li>
            </template>
            <template is="dom-if" if="[[_hasComponent('vertical-lineage')]]">
            <li>
            <dom-if if="[[ _displayVerticalLineageButton(items)]]" >
                <template>
                    <a on-click="_buttonClick" href="#/asset-lineage/verticalLineage/[[guid]]" title="Vertical Lineage">
                        <paper-button raised>
                        <iron-icon  icon="vaadin:file-tree"></iron-icon>
                        <div>&nbsp;Vertical Lineage</div>
                        </paper-button>
                    </a>
                </template>
                </dom-if>
            </li>
            </template>
            <template is="dom-if" if="[[_hasComponent('source-and-destination')]]">
            <li> 
                <a on-click="_buttonClick" href="#/asset-lineage/sourceAndDestination/[[guid]]" title="Source and Destination Lineage">
                <paper-button raised>
                    <iron-icon  icon="vaadin:exchange"></iron-icon>
                    <div>&nbsp;Source & Dest</div>
                    </paper-button>
                </a>
            </li>
            <template is="dom-if" if="[[_hasComponent('rex')]]">
                <li> 
                    <a on-click="_buttonClick" href="#/repository-explorer/[[omas.serverName]]/[[ _encode(omas.baseUrl) ]]/[[guid]]" title="Repository explorer">
                        <paper-button raised>
                        <iron-icon icon="vaadin:cogs"></iron-icon>
                        <div>&nbsp;REX</div>
                        </paper-button>
                    </a>
                </li>
            </template>
        </ul>
        </template>
    `;
    }

    _buttonClick(){
        this.dispatchEvent(new CustomEvent('button-click', {
            bubbles: true,
            composed: true,
            detail: {}
        }));
    }

    _displayVerticalLineageButton(item) {
        return (item === 'RelationalColumn' || item === 'TabularColumn' || item === 'GlossaryTerm');
    }

    _encode(val) {
        return btoa(val);
    }

}

window.customElements.define('asset-tools', AssetTools);