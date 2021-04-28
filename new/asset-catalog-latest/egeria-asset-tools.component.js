/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */
import {PolymerElement, html} from '@polymer/polymer';

import '../../src/shared-styles.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-item/paper-item-body.js';
import '@polymer/paper-styles/paper-styles.js';
import '@vaadin/vaadin-icons/vaadin-icons.js';
import { egeriaFetch } from '../commons/fetch.js';

class EgeriaAssetTools extends PolymerElement {
  static get properties() {
    return {
      guid: { type: String, value: '' },
      type: { type: String, value: '' },
      item: { type: Object, value: {} },
      components: { type: Array, value: [] },
      settings: { type: Object, value: {} }
    }
  }

  ready() {
    super.ready();

    egeriaFetch(`/api/ui/settings`)
      .then(response => response.json())
      .then(response => {
        this.settings = response;
      });
  }

  btoa(string) {
    return window.btoa(string);
  }

  _hasComponent(component) {
    if(this.components.length === 0) {
      return true;
    }

    return Array.isArray(this.components) && (this.components.includes("*") || this.components.includes(component));
  }

  _buttonClick(){
    this.dispatchEvent(new CustomEvent('button-click', {
      bubbles: true,
      composed: true,
      detail: {}
    }));
  }

  _displayVerticalLineageButton(type) {
    return (type === 'RelationalColumn' || type === 'TabularColumn' || type === 'GlossaryTerm');
  }

  _encode(val) {
    return btoa(val);
  }

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

        <template is="dom-if" if="[[ components ]]">
          <ul id="menu">
            <template is="dom-if" if="[[ _hasComponent('ultimate-source') ]]">
              <li>
                <a on-click="_buttonClick" href="/asset-lineage/[[ btoa(guid) ]]/ultimate-source" title="Ultimate Source Lineage">
                  <paper-button raised>
                  <iron-icon icon="vaadin:connect-o" style="transform: rotate(180deg)"></iron-icon>

                  <div>&nbsp;Source</div>
                  </paper-button>
                </a>
              </li>
            </template>
            <template is="dom-if" if="[[ _hasComponent('end-to-end') ]]">
              <li>
                <a on-click="_buttonClick" href="/asset-lineage/[[ btoa(guid) ]]/end-to-end" title="End2End Lineage">
                  <paper-button raised>
                    <iron-icon icon="vaadin:cluster"></iron-icon>

                    <div>&nbsp;End2End</div>
                  </paper-button>
                </a>
              </li>
            </template>
            <template is="dom-if" if="[[ _hasComponent('ultimate-destination') ]]">
            <li>
              <a on-click="_buttonClick" href="/asset-lineage/[[ btoa(guid) ]]/ultimate-destination" title="Ultimate Destination Lineage">
                <paper-button raised>
                  <iron-icon icon="vaadin:connect-o"></iron-icon>

                  <div>&nbsp;Dest</div>
                </paper-button>
              </a>
            </li>
            </template>
            <template is="dom-if" if="[[ _hasComponent('vertical-lineage') ]]">
              <template is="dom-if" if="[[ _displayVerticalLineageButton(type) ]]">
                <li>
                  <a on-click="_buttonClick" href="/asset-lineage/[[ btoa(guid) ]]/vertical-lineage" title="Vertical Lineage">
                    <paper-button raised>
                      <iron-icon  icon="vaadin:file-tree"></iron-icon>

                      <div>&nbsp;Vertical Lineage</div>
                    </paper-button>
                  </a>
                </li>
              </template>
            </template>
            <template is="dom-if" if="[[ _hasComponent('source-and-destination') ]]">
              <li>
                  <a on-click="_buttonClick" href="/asset-lineage/[[ btoa(guid) ]]/source-and-destination" title="Source and Destination Lineage">
                    <paper-button raised>
                      <iron-icon  icon="vaadin:exchange"></iron-icon>

                      <div>&nbsp;Source & Dest</div>
                    </paper-button>
                  </a>
              </li>
            </template>
            <template is="dom-if" if="[[ _hasComponent('rex') ]]">
              <li>
                <a on-click="_buttonClick" href="/repository-explorer/[[ omas.serverName ]]/[[ _encode(omas.baseUrl) ]]/[[ guid ]]" title="Repository explorer">
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
}

window.customElements.define('egeria-asset-tools', EgeriaAssetTools);