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

class AssetLineageView extends mixinBehaviors([ItemViewBehavior], PolymerElement) {
  ready() {
    super.ready();

    let thisElement = this;

    this.$.tokenAjax.addEventListener('error', () =>
      thisElement.$.visgraph.importNodesAndEdges([], []));

    this.$.processToggle.addEventListener('change', () =>
      this._reload(this.$.useCases.items[this.$.useCases.selected].value, this.$.processToggle.checked));

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
        type: Array,
        value: [
          'ultimateSource',
          'endToEnd',
          'ultimateDestination',
          'verticalLineage',
          'sourceAndDestination'
        ]
      },
      graphData: {
        type: Object,
        observer: '_graphDataChanged'
      },
      groups: {
        type: Object,
        value: {
          AssetZoneMembership: {
            icon: 'simple-square'
          },
          Category: {
            icon: 'carbon-category'
          },
          Column: {
            icon: 'simple-square'
          },
          condensedNode: {
            icon: 'simple-square'
          },
          Connection: {
            icon: 'mdi-transit-connection-variant'
          },
          Database: {
            icon: 'dashicons-database'
          },
          DataFile: {
            icon: 'bi-file-earmark'
          },
          FileFolder: {
            icon: 'bi-folder'
          },
          Glossary: {
            icon: 'carbon-data-structured'
          },
          GlossaryCategory: {
            icon: 'carbon-category'
          },
          GlossaryTerm: {
            icon: 'ion-list-circle-outline'
          },
          Path: {
            icon: 'file-icons-microsoft-infopath'
          },
          Process: {
            icon: 'whh-cog'
          },
          ProjectName: {
            icon: 'file-icons-microsoft-project'
          },
          RelationalColumn: {
            icon: 'mdi-table-column'
          },
          RelationalTable: {
            icon: 'bi-table'
          },
          Schema: {
            icon: 'system-uicons-hierarchy'
          },
          subProcess: {
            icon: 'mdi-cogs'
          },
          TabularColumn: {
            icon: 'carbon-column'
          }
        }
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

    if (!['condensedNode', 'subProcess'].includes(_selectedNode.group)) {
      this.selectedNode = _selectedNode;

      this.$.tokenAjaxDetails.url = `/api/assets/${nodeId}`;
      this.$.tokenAjaxDetails._go();

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
            icon: this.groups[camelCased] ? this.groups[camelCased].icon : 'simple-square'
          }
        });

        let result = {
          id: n.id,
          type: this.groups[n.group].icon,
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
    if (data.edges.length === 0 || data.nodes.length === 0) {
      this.dispatchEvent(new CustomEvent('show-modal', {
        bubbles: true,
        composed: true,
        detail: {
          message: 'No lineage information available',
          level: 'info'
        }
      }));
    }

    this._updateHappiGraph(data);
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
          break;
      }
  }

  _getUseCase(usecase) {
    return this.usecases.indexOf(usecase);
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
      </style>

      <app-route route="{{route}}"
                pattern="/:usecase/:guid"
                data="{{routeData}}"
                tail="{{tail}}"></app-route>

      <token-ajax id="tokenAjax"
                  last-response="{{graphData}}"></token-ajax>

      <token-ajax id="tokenAjaxDetails"
                  last-response="{{item}}"></token-ajax>

      <div>
        <vaadin-tabs id ="useCases"  selected="[[ _getUseCase(routeData.usecase) ]]" >
          <vaadin-tab value="ultimateSource" >
            <a href="[[rootPath]]#/asset-lineage/ultimateSource/[[routeData.guid]]"
               tabindex="-1"
               rel="noopener">
              Ultimate Source
            </a>
          </vaadin-tab>

          <vaadin-tab value="endToEnd">
            <a href="[[rootPath]]#/asset-lineage/endToEnd/[[routeData.guid]]"
               tabindex="-1"
               rel="noopener">
              End to End Lineage
            </a>
          </vaadin-tab>

          <vaadin-tab value="ultimateDestination">
            <a href="[[rootPath]]#/asset-lineage/ultimateDestination/[[routeData.guid]]"
               tabindex="-1"
               rel="noopener">
              Ultimate Destination
            </a>
          </vaadin-tab>

          <dom-if if="[[_displayVerticalLineageButton(item)]]">
            <template>
              <vaadin-tab value="verticalLineage">
                <a href="[[rootPath]]#/asset-lineage/verticalLineage/[[routeData.guid]]"
                   tabindex="-1"
                   rel="noopener">
                  Vertical Lineage
                </a>
              </vaadin-tab>
            </template>
          </dom-if>

          <vaadin-tab value="sourceAndDestination">
            <a href="[[rootPath]]#/asset-lineage/sourceAndDestination/[[routeData.guid]]"
               tabindex="-1"
               rel="noopener">
              Source and Destination
            </a>
          </vaadin-tab>
        </vaadin-tabs>

        <ul id="menu">
          <li>
            <paper-button raised on-click="zoomOut">-</paper-button>
          </li>
          <li>
            <paper-button raised on-click="zoomIn">+</paper-button>
          </li>
          <li>
            <paper-button raised on-click="fitToScreen">Fit to screen</paper-button>
          </li>
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
        <div>
          <a dialog-confirm
             style="float: right"
             title="close">
            <iron-icon icon="icons:close"
                       style="width: 24px;height: 24px;"></iron-icon>
          </a>
        </div>

        <asset-tools items="[[selectedNode.type]]"
                     guid="[[selectedNode.id]]"
                     style="display: inline-flex"></asset-tools>
      </paper-dialog>
    `;
  }
}

window.customElements.define('asset-lineage-view', AssetLineageView);
