/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import 'happi-graph/happi-graph';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';

import {
  iconsMap,
  itemGroupIconMap,
  linksTypeIconMap
} from 'egeria-js-commons';

class EgeriaAssetLineageViewer extends PolymerElement {
  static get properties() {
    return {
      pages: { type: Array, observer: '_pagesChanged' },
      nextPages: { type: Array, value: [''] },
      page: { type: String, value: '' },

      graphDirection: { type: String, value: null },
      graphData: { type: Object, value: null },
      toggleEtlJobs: { type: Boolean, value: null },
      hasVerticalTab: { type: Boolean, value: false }
    };
  }

  ready() {
    super.ready();

    this.shadowRoot.querySelector('#happi-graph')
      .addEventListener('happi-graph-on-node-click', (e) => {
        let evt = new CustomEvent('happi-graph-on-node-click', {
          detail: {
            ...e.detail
          },
          bubbles: true,
          composed: true
        });

        window.dispatchEvent(evt);
      });

    this.shadowRoot.querySelector('#happi-graph')
      .addEventListener('happi-graph-on-cached-graph', (e) => {
        let evt = new CustomEvent('happi-graph-on-cached-graph', {
          detail: {
            ...e.detail
          },
          bubbles: true,
          composed: true
        });

        window.dispatchEvent(evt);
      });
  }

  showStatistics() {
    let evt = new CustomEvent('egeria-toggle-statistics', {
      detail: {},
      bubbles: true,
      composed: true
    });

    window.dispatchEvent(evt);
  }

  onToggleETLJobs() {
    let evt = new CustomEvent('egeria-toggle-etl-jobs', {
      detail: {},
      bubbles: true,
      composed: true
    });

    window.dispatchEvent(evt);
  }

  getItemGroupIconMap() {
    return itemGroupIconMap;
  }

  getHappiGraphIconsMap() {
    return iconsMap;
  }

  getHappiGraphLinksTypeIconMap() {
    return linksTypeIconMap;
  }

  static get template() {
    return html`
      <style>
        :host {
          display:block;
          height:100%;
        }

        .container {
          background-color: var(--egeria-background-color);
          height: 100%;
        }
      </style>

      <div class="container">
        <happi-graph id="happi-graph"
                     icons-map="[[ getHappiGraphIconsMap() ]]"
                     properties-map="[[ getItemGroupIconMap() ]]"
                     links-type-icon-map="[[ getHappiGraphLinksTypeIconMap() ]]"
                     graph-direction="[[ graphDirection ]]"
                     graph-data="[[ graphData ]]"
                     algorithm="VISJS">
                     <!-- elk-worker-url="/node_modules/elkjs/lib/elk-worker.js" -->
          <div slot="pre-actions">
            <template is="dom-if" if="[[ !hasVerticalTab ]]">
              <paper-toggle-button id="processToggle" checked="[[ toggleEtlJobs ]]" on-change="onToggleETLJobs">
                ETL Jobs
              </paper-toggle-button>
            </template>
          </div>

          <div slot="post-actions">
            <paper-icon-button icon="icons:assessment" on-click="showStatistics"></paper-icon-button>
          </div>
        </happi-graph>
      </div>
    `;
  }
}

window.customElements.define('egeria-asset-lineage-viewer', EgeriaAssetLineageViewer);
