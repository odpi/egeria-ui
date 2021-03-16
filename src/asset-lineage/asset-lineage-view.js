/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '../shared-styles.js';
import '../asset-catalog/asset-tools';
import '../common/props-table';

import '@polymer/paper-dialog/paper-dialog';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/paper-progress/paper-progress';
import '@vaadin/vaadin-radio-button/vaadin-radio-button.js';
import '@vaadin/vaadin-radio-button/vaadin-radio-group.js';
import '@vaadin/vaadin-tabs/vaadin-tabs.js';
import '@vaadin/vaadin-item/vaadin-item.js';
import '@vaadin/vaadin-list-box/vaadin-list-box.js';

import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class';
import { ItemViewBehavior } from '../common/item';

import '../common/happi-graph';
import { RoleComponentsBehavior } from "../common/role-components";

import {
  itemGroupIconMap
} from '../common/item-group-icon-map';

class AssetLineageView extends mixinBehaviors([ItemViewBehavior, RoleComponentsBehavior], PolymerElement) {
  ready() {
    super.ready();

    let thisElement = this;

    this.$.processToggle.addEventListener('change', () => {
      this._reload(this.routeData.usecase, this.$.processToggle.checked);
    });

    this.shadowRoot.querySelector('#happi-graph')
      .addEventListener('happi-graph-on-node-click', (e) => {
        this.onNodeClick(e.detail ? e.detail.nodeId : null);
      });

  }

  static get properties() {
    return {
      selectedNode: {
        type: Object,
        value: {}
      },
      happiGraphData: {
        type: Object,
        value: {
          nodes: [],
          links: [],
          graphDirection: ''
        }
      },
      usecases: {
        type: Object,
        value: {
          ultimateSource      : 'Ultimate Source',
          endToEnd            : 'End to End Lineage',
          ultimateDestination : 'Ultimate Destination',
          verticalLineage     : 'Vertical Lineage',
          sourceAndDestination: 'Source and Destination'
        }
      },
      graphData: {
        type: Object,
        observer: '_graphDataChanged'
      }
    }
  }

  onNodeClick(nodeId) {
    let _selectedNode = null;

    if (nodeId) {
      _selectedNode = this.graphData
        .nodes
        .filter(n => n.id === nodeId)
        .pop();
    }

    if (!['condensedNode', 'subProcess', 'Process'].includes(_selectedNode.group)) {
      this.selectedNode = _selectedNode;
      this.shadowRoot.querySelector('#paper-dialog').open();
    }
  }

  zoomOut() {
    this.shadowRoot.querySelector('#happi-graph').customZoomOut();
  }

  zoomIn() {
    this.shadowRoot.querySelector('#happi-graph').customZoomIn();
  }

  fitToScreen() {
    this.shadowRoot.querySelector('#happi-graph').fitContent();
  }

  resetGraph() {
    this._reload(this.routeData.usecase, this.$.processToggle.checked);
  }

  showStatistics() {
    this.shadowRoot.querySelector('#happi-graph').hideUnhideStatistics();
  }

  reloadGraph() {
    window.location.reload();
  }

  _noGuid(routeData) {
    return routeData === undefined
      || routeData.guid === undefined
      || routeData.guid === "";
  }

  _noLineage(routeData) {
    return !this._noGuid(routeData)
      && this.graphData
      && this.graphData.nodes
      && this.graphData.nodes.length == 0;
  }

  _closeDialog(){
    this.shadowRoot.querySelector('#paper-dialog').close();
  }

  static get observers() {
    return [
      '_routeChanged(route)'
    ];
  }

  _routeChanged(route) {
    if (this.route.prefix === '/asset-lineage') {
      if (this.routeData && this.routeData.guid) {
        this.$.tokenAjaxDetails.url = '/api/assets/' + this.routeData.guid;
        this.$.tokenAjaxDetails._go();
      }

      this._reload(this.routeData.usecase, this.$.processToggle.checked);
    }
  }

  _updateHappiGraph(data) {
    let myData = {
      graphDirection: this.happiGraphData.graphDirection, // HORIZONTAL, VERTICAL

      nodes: data.nodes.map(n => {
        let keys = Object.keys(n.properties ? n.properties : {});

        let props = keys.map(k => {
          let camelCased = k.charAt(0).toUpperCase() + k.slice(1);

          return {
            value: n.properties[k],
            label: k,
            icon: itemGroupIconMap[camelCased] ? itemGroupIconMap[camelCased].icon : 'simple-square',
            groupName: camelCased
          }
        });

        let result = {
          id: n.id,
          type: itemGroupIconMap[n.group].icon,
          value: n.label ? n.label : 'N/A',
          label: n.group ? n.group : 'N/A',
          selected: n.id === this.routeData.guid,
          properties: [
            ...props
          ]
        };

        return result;
      }),
      links: []
    };

    myData.links = data.edges.map(e => {
      return {
        id: `${e.from}-${e.to}`,
        label: e.label,
        source: e.from,
        from: e.from,
        to: e.to,
        target: e.to,
        connectionToSource: false,
        connectionToTarget: true
      };
    });

    this.happiGraphData = {
      ...myData
    };
  }

  _graphDataChanged(data) {
    if ( data!==null &&  data.nodes.length === 0 ) {
      this.dispatchEvent(new CustomEvent('show-modal', {
        bubbles: true,
        composed: true,
        detail: {
          message: 'No lineage information available',
          level: 'info'
        }
      }));
    }

    if (data !== null) {
      this._updateHappiGraph(data);
    } else {
      this._updateHappiGraph({
        nodes: [],
        edges: []
      });
    }
  }

  _ultimateSource(guid, includeProcesses) {
    if (includeProcesses === null
      || includeProcesses === undefined) {
      includeProcesses = 'true';
    }

    this.happiGraphData.graphDirection = 'HORIZONTAL';

    this.$.tokenAjax.url = '/api/lineage/entities/' + guid + '/ultimate-source?includeProcesses=' + includeProcesses;
    this.$.tokenAjax._go();
  }

  _endToEndLineage(guid, includeProcesses) {
    if (includeProcesses === null
      || includeProcesses === undefined) {
      includeProcesses = 'true';
    }

    this.happiGraphData.graphDirection = 'HORIZONTAL';

    this.$.tokenAjax.url = '/api/lineage/entities/' + guid + '/end2end?includeProcesses=' + includeProcesses;
    this.$.tokenAjax._go();
  }

  _ultimateDestination(guid, includeProcesses) {
    if (includeProcesses === null
      || includeProcesses === undefined) {
      includeProcesses = 'true';
    }

    this.happiGraphData.graphDirection = 'HORIZONTAL';

    this.$.tokenAjax.url = '/api/lineage/entities/' + guid + '/ultimate-destination?includeProcesses=' + includeProcesses;
    this.$.tokenAjax._go();
  }

  _verticalLineage(guid, includeProcesses) {
    if (includeProcesses === null
      || includeProcesses === undefined) {
      includeProcesses = 'true';
    }

    this.happiGraphData.graphDirection = 'VERTICAL';

    this.$.tokenAjax.url = '/api/lineage/entities/' + guid + '/vertical-lineage?includeProcesses=' + includeProcesses;
    this.$.tokenAjax._go();
  }

  _sourceAndDestination(guid, includeProcesses) {
    if (includeProcesses === null
      || includeProcesses === undefined) {
      includeProcesses = 'true';
    }

    this.happiGraphData.graphDirection = 'HORIZONTAL';

    this.$.tokenAjax.url = '/api/lineage/entities/' + guid + '/source-and-destination?includeProcesses=' + includeProcesses;
    this.$.tokenAjax._go();
  }

  _reload(usecase, includeProcesses) {
    if (this.routeData.guid !== undefined
      && this.routeData.guid !== '')
      switch (usecase) {
        case 'ultimateSource':
          this._ultimateSource(this.routeData.guid, includeProcesses);

          break;
        case 'endToEnd':
          this._endToEndLineage(this.routeData.guid, includeProcesses);

          break;
        case 'ultimateDestination':
          this._ultimateDestination(this.routeData.guid, includeProcesses);
          break;
        case 'verticalLineage':
          this._verticalLineage(this.routeData.guid, includeProcesses);

          break;
        case 'sourceAndDestination':
          this._sourceAndDestination(this.routeData.guid, includeProcesses);

          break;
        default:
          console.warn('NOT_FOUND');
      }
  }



  _displayETLJobsToggle(useCase) {
    return useCase === 'verticalLineage';
  }

  _displayVerticalLineageButton(item) {
    let type = '';

    if (item === undefined || item.type === undefined || item.type.name === undefined) {
      return false;
    } else {
      type = item.type.name;
    }

    return type === 'RelationalColumn' || type === 'TabularColumn' || type === 'GlossaryTerm';
  }

  _getPropertiesForDisplay(item) {
    let displayName = item.label;
    let guid = item.id;
    let summary = item.summary;
    let description = item.description;
    let displayProperties = {
      displayName: displayName,
      guid: guid
    };
    if (summary) {
      displayProperties.summary = summary;
    }
    if (description) {
      displayProperties.description = description;
    }

    return this._attributes(displayProperties);
  }

  hasSize(data) {
    if(data) {
      return Object.keys(data).length > 0;
    } else {
      return false;
    }
  }

  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: flex;
          flex-direction: column;
          margin:var(--egeria-view-margin);
          min-height: var(--egeria-view-min-height);
          max-height: var(--egeria-view-min-height);
        }

        #container {
          background-color: var(--egeria-background-color);
          display: flex;
          flex-grow: 1;
        }

        #useCases {
          color: var(--egeria-primary-color);
          width: fit-content;
          margin: auto;
        }

        ul#menu, ul#menu li {
          padding-left: 0;
          margin-right: 16px;
        }

        .local-wrapper {
          width:730px;
        }
      </style>

      <app-route route="{{route}}"
                pattern="/:usecase/:guid"
                data="{{routeData}}"
                tail="{{tail}}"></app-route>

      <token-ajax id="tokenAjax"
                  last-response="{{graphData}}"></token-ajax>

      <token-ajax id="tokenAjaxDetails"
                  last-response="{{item}}"></token-ajax>

      <token-ajax id="tokenAjaxClickedNode"
                  last-response="{{clickedItem}}"></token-ajax>

      <iron-localstorage name="user-components" value="{{components}}"></iron-localstorage>

      <div>
        <template is="dom-if" if="[[components]]">
          <vaadin-tabs id="useCases" selected="[[ _usecaseIndex(routeData.usecase) ]]">
            <template is="dom-if" if="[[_hasComponent('ultimate-source')]]">
              <vaadin-tab value="ultimateSource" >
                <a href="[[rootPath]]#/asset-lineage/ultimateSource/[[routeData.guid]]"
                  tabindex="-1"
                  rel="noopener">
                  [[ usecases.ultimateSource ]]
                </a>
              </vaadin-tab>
            </template>

            <template is="dom-if" if="[[_hasComponent('end-to-end')]]">
              <vaadin-tab value="endToEnd">
                <a href="[[rootPath]]#/asset-lineage/endToEnd/[[routeData.guid]]"
                  tabindex="-1"
                  rel="noopener">
                  [[ usecases.endToEnd ]]
                </a>
              </vaadin-tab>
            </template>

            <template is="dom-if" if="[[_hasComponent('ultimate-destination')]]">
              <vaadin-tab value="ultimateDestination">
                <a href="[[rootPath]]#/asset-lineage/ultimateDestination/[[routeData.guid]]"
                  tabindex="-1"
                  rel="noopener">
                  [[ usecases.ultimateDestination ]]
                </a>
              </vaadin-tab>
            </template>

            <template is="dom-if" if="[[_hasComponent('vertical-lineage')]]">
              <dom-if if="[[_displayVerticalLineageButton(item)]]">
                <template>
                  <vaadin-tab value="verticalLineage">
                    <a href="[[rootPath]]#/asset-lineage/verticalLineage/[[routeData.guid]]"
                      tabindex="-1"
                      rel="noopener">
                      [[ usecases.verticalLineage ]]
                    </a>
                  </vaadin-tab>
                </template>
              </dom-if>
            </template>

            <template is="dom-if" if="[[_hasComponent('source-and-destination')]]">
              <vaadin-tab value="sourceAndDestination">
                <a href="[[rootPath]]#/asset-lineage/sourceAndDestination/[[routeData.guid]]"
                  tabindex="-1"
                  rel="noopener">
                  [[ usecases.sourceAndDestination ]]
                </a>
              </vaadin-tab>
            </template>
          </vaadin-tabs>
        </template>

        <ul id="menu">
          <li><paper-button raised on-click="zoomOut">-</paper-button></li>
          <li><paper-button raised on-click="zoomIn">+</paper-button></li>
          <li><paper-button raised on-click="fitToScreen">Fit to screen</paper-button></li>
          <li><paper-button raised on-click="resetGraph">Reset graph</paper-button></li>
          <li><paper-button raised on-click="showStatistics">Statistics</paper-button></li>
          <li>
            <div hidden="[[_displayETLJobsToggle(routeData.usecase)]]">
              <paper-toggle-button id="processToggle" checked>
                ETL Jobs
              </paper-toggle-button>
            </div>
          </li>
        </ul>
      </div>
      <dom-if if="[[_noGuid(routeData)]]" restamp="true">
        <template>
          <div class="warning" style="display: block; margin: auto">
            <p>Please use
              <a href="[[rootPath]]#/asset-catalog/search" >
                [ Asset Catalog ]
              </a>
              to select an asset to view lineage.
            </p>
          </div>
        </template>
      </dom-if>

      <div id="container">
        <happi-graph id="happi-graph" graph-data="[[happiGraphData]]"></happi-graph>
      </div>

      <!-- extract this to separate component -->
      <paper-dialog id="paper-dialog" class="paper-dialog">
        <div class="local-wrapper">
          <div>
            <a dialog-confirm
              style="float: right"
              title="close">
              <iron-icon icon="icons:close"
                        style="width: 24px;height: 24px;"></iron-icon>
            </a>
          </div>

          <asset-tools type="[[selectedNode.group]]"
                      guid="[[selectedNode.id]]"
                      on-button-click="_closeDialog"
                      style="display: inline-flex"></asset-tools>

          <template is="dom-if" if="[[selectedNode]]">
            <props-table items="[[_getPropertiesForDisplay(selectedNode)]]" title="Properties" with-row-stripes ></props-table>

            <template is="dom-if" if="[[hasSize(selectedNode.properties)]]" restramp="true">
              <props-table items="[[_attributes(selectedNode.properties)]]" title="Context" with-row-stripes ></props-table>
            </template>
          </template>
          <div></div>
        </div>
      </paper-dialog>
    `;
  }
}

window.customElements.define('asset-lineage-view', AssetLineageView);
