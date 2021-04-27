/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import 'happi-graph/happi-graph';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';

import {
  iconsMap,
  itemGroupIconMap
} from 'egeria-js-commons';

class EgeriaAssetLineageViewer extends PolymerElement {
  static get properties() {
    return {
      pages: { type: Array, observer: '_pagesChanged' },
      nextPages: { type: Array, value: [''] },
      page: { type: String, value: '' },

      graphDirection: { type: String, value: null },
      graphData: { type: Object, value: null }
    };
  }

  getItemGroupIconMap() {
    return itemGroupIconMap;
  }

  getHappiGraphIconsMap() {
    return iconsMap;
  }

  onNodeClick(nodeId) {
    console.log(nodeId);
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
          height:100%;
        }
      </style>

      <div class="container">
        <happi-graph id="happi-graph"
                     icons-map="[[ getHappiGraphIconsMap() ]]"
                     properties-map="[[ getItemGroupIconMap() ]]"
                     graph-direction="[[ graphDirection ]]"
                     graph-data="[[ graphData ]]">
          <div slot="pre-actions">
            <div hidden="[[ _displayETLJobsToggle(routeData.usecase) ]]">
                <paper-toggle-button id="processToggle" checked>
                  ETL Jobs
                </paper-toggle-button>
              </div>
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
