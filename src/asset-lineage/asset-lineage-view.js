/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '../shared-styles.js';
import '../common/vis-graph.js';
import '@vaadin/vaadin-radio-button/vaadin-radio-button.js';
import '@vaadin/vaadin-radio-button/vaadin-radio-group.js';
import '@vaadin/vaadin-tabs/vaadin-tabs.js';
import '@vaadin/vaadin-item/vaadin-item.js';
import '@vaadin/vaadin-list-box/vaadin-list-box.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class';
import { ItemViewBehavior } from '../common/item';
import '../common/happi-graph';

class AssetLineageView extends mixinBehaviors([ItemViewBehavior], PolymerElement) {
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
          background-color: var( --egeria-background-color );
          display: flex;
          flex-direction: column;
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
<<<<<<< HEAD
          </div>
        </template>
      </dom-if>
=======
        </div>
    </template>
    </dom-if>

    <div id="container" >
        <vis-graph id="visgraph" groups=[[groups]] data=[[graphData]] ></vis-graph>

        <happi-graph id="happi-graph" graph-data="[[happiGraphData]]"></happi-graph>
    </div>
>>>>>>> c392729630... Refactor and update asset lineage component

      <div id="container">
        <happi-graph id="happi-graph" graph-data="[[happiGraphData]]"></happi-graph>
      </div>
    `;
  }

  ready() {
    super.ready();

    var thisElement = this;

    this.$.tokenAjax.addEventListener('error', () =>
      thisElement.$.visgraph.importNodesAndEdges([], []));

    this.$.processToggle.addEventListener('change', () =>
      this._reload(this.$.useCases.items[this.$.useCases.selected].value, this.$.processToggle.checked));

  }

  static get properties() {
    return {
      happiGraphData: {
        type: Object,
        value: {
          nodes: [],
          links: [],
          selectedNodePosition: '',
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
<<<<<<< HEAD
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
=======
            icon: 'vaadin:handshake',
            newIcon: 'simple-square'
          },
          Category: {
            icon: 'carbon-category',
            newIcon: 'carbon-category'
          },
          Column: {
            icon: 'vaadin:grid-h',
            newIcon: 'simple-square'
          },
          condensedNode: {
            icon: 'vaadin:cogs',
            newIcon: 'simple-square'
          },
          Connection: {
            icon: 'mdi-transit-connection-variant',
            newIcon: 'mdi-transit-connection-variant'
          },
          Database: {
            icon: 'dashicons-database',
            newIcon: 'dashicons-database'
          },
          DataFile: {
            icon: 'vaadin:file',
            newIcon: 'bi-file-earmark'
          },
          FileFolder: {
            icon: 'bi-folder',
            newIcon: 'bi-folder'
          },
          Glossary: {
            icon: 'carbon-data-structured',
            newIcon: 'carbon-data-structured'
          },
          GlossaryCategory: {
            icon: 'vaadin:ticket',
            newIcon: 'carbon-category'
          },
          GlossaryTerm: {
            icon: 'vaadin:records',
            newIcon: 'ion-list-circle-outline'
          },
          Path: {
            icon: 'file-icons-microsoft-infopath',
            newIcon: 'file-icons-microsoft-infopath'
          },
          Process: {
            icon: 'vaadin:file-process',
            newIcon: 'whh-cog'
          },
          ProjectName: {
            icon: 'file-icons-microsoft-project',
            newIcon: 'file-icons-microsoft-project'
          },
          RelationalColumn: {
            icon: 'vaadin:road-branches',
            newIcon: 'mdi-table-column'
          },
          RelationalTable: {
            icon: 'vaadin:table',
            newIcon: 'bi-table'
          },
          Schema: {
            icon: 'system-uicons-hierarchy',
            newIcon: 'system-uicons-hierarchy'
          },
          subProcess: {
            icon: 'vaadin:cogs',
            newIcon: 'mdi-cogs'
          },
          TabularColumn: {
            icon: 'vaadin:tab',
            newIcon: 'carbon-column'
>>>>>>> ec250fda85... Add icons for happi-graph component
          }
        }
      }
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

<<<<<<< HEAD
=======
  _parseProperties(props) {
    var obj = {};
    Object.keys(props).forEach(
      (key) => {
        var newKey = key.split("vertex--").join("");
        obj[newKey] = "" + props[key];
      }
    );
    return obj;
  }


>>>>>>> c392729630... Refactor and update asset lineage component
  _updateHappiGraph(data) {
    let myData = {
      selectedNodePosition: this.happiGraphData.selectedNodePosition,  // FIRST, CENTER, LAST
      graphDirection: this.happiGraphData.graphDirection,              // HORIZONTAL, VERTICAL

      nodes: data.nodes.map(n => {
        let keys = Object.keys(n.properties);

        let props = keys.map(k => {
          let camelCased = k.charAt(0).toUpperCase() + k.slice(1);

          return {
            value: n.properties[k],
            label: k,
<<<<<<< HEAD
            icon: this.groups[camelCased] ? this.groups[camelCased].icon : 'simple-square'
=======
            icon: this.groups[camelCased] ? this.groups[camelCased].newIcon : 'simple-square'
>>>>>>> ec250fda85... Add icons for happi-graph component
          }
        });

        let result = {
          id: n.id,
          type: this.groups[n.group].newIcon,
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

  _graphDataChanged(data, newData) {
    if (data === null || data === undefined) {
      if (newData && newData != null) {
        data = newData;
      } else {
        data = {
          nodes: [],
          edges: []
        };
      }
    }

    this._updateHappiGraph(data);
<<<<<<< HEAD
=======

    if (data.nodes.length == 0) {
      this.dispatchEvent(new CustomEvent('show-modal', {
        bubbles: true,
        composed: true,
        detail: { message: "No lineage information available", level: 'info' }
      }));
    }
    const egeriaColor = getComputedStyle(this).getPropertyValue('--egeria-primary-color');
    for (var i = 0; i < data.nodes.length; i++) {
      let displayName;
      if (data.nodes[i].properties && data.nodes[i].properties !== null && data.nodes[i].properties !== undefined) {
        data.nodes[i].properties = this._parseProperties(data.nodes[i].properties);

        if (data.nodes[i].properties['tableDisplayName'] != null
          && data.nodes[i].properties['tableDisplayName'] != undefined) {
          displayName = data.nodes[i].properties['tableDisplayName']
        }
      }
      data.nodes[i].displayName = data.nodes[i].label;
      data.nodes[i].type = data.nodes[i].group;
      data.nodes[i].label = '<b>' + data.nodes[i].label + '</b>';
      data.nodes[i].groupInfo = this._camelCaseToSentence(data.nodes[i].group);

      if (displayName != null) {
        data.nodes[i].dispName = 'From : ' + displayName;
      }
      if (data.nodes[i].id === this.routeData.guid) {
        data.nodes[i].isQueridNode = true;
        data.nodes[i].color = {
          background: 'white',
          border: egeriaColor,
          highlight: { background: egeriaColor, border: '#a7a7a7' },
          hover: { background: 'white', border: '#a7a7a7' }
        };
      } else {
        data.nodes[i].color = {
          background: 'white',
          border: '#a7a6a6',
          highlight: { background: egeriaColor, border: '#a7a7a7' },
          hover: { background: 'white', border: '#a7a7a7' }
        };
      }
    }
    this.$.visgraph.importNodesAndEdges(data.nodes, data.edges);
>>>>>>> c392729630... Refactor and update asset lineage component
  }

  _ultimateSource(guid, includeProcesses) {
    if (includeProcesses === null
      || includeProcesses === undefined) {
      includeProcesses = 'true';
    }

    this.happiGraphData.selectedNodePosition = 'LAST';
    this.happiGraphData.graphDirection = 'HORIZONTAL';

    this.$.tokenAjax.url = '/api/lineage/entities/' + guid + '/ultimate-source?includeProcesses=' + includeProcesses;
    this.$.tokenAjax._go();
  }

  _endToEndLineage(guid, includeProcesses) {
    if (includeProcesses === null
      || includeProcesses === undefined) {
      includeProcesses = 'true';
    }

    this.happiGraphData.selectedNodePosition = 'CENTER';
    this.happiGraphData.graphDirection = 'HORIZONTAL';

    this.$.tokenAjax.url = '/api/lineage/entities/' + guid + '/end2end?includeProcesses=' + includeProcesses;
    this.$.tokenAjax._go();
  }

  _ultimateDestination(guid, includeProcesses) {
    if (includeProcesses === null
      || includeProcesses === undefined) {
      includeProcesses = 'true';
    }

    this.happiGraphData.selectedNodePosition = 'FIRST';
    this.happiGraphData.graphDirection = 'HORIZONTAL';

    this.$.tokenAjax.url = '/api/lineage/entities/' + guid + '/ultimate-destination?includeProcesses=' + includeProcesses;
    this.$.tokenAjax._go();
  }

  _verticalLineage(guid, includeProcesses) {
    if (includeProcesses === null
      || includeProcesses === undefined) {
      includeProcesses = 'true';
    }

    this.happiGraphData.selectedNodePosition = 'FIRST';
    this.happiGraphData.graphDirection = 'VERTICAL';

    this.$.tokenAjax.url = '/api/lineage/entities/' + guid + '/vertical-lineage?includeProcesses=' + includeProcesses;
    this.$.tokenAjax._go();
  }

  _sourceAndDestination(guid, includeProcesses) {
    if (includeProcesses === null
      || includeProcesses === undefined) {
      includeProcesses = 'true';
    }

    this.happiGraphData.selectedNodePosition = 'CENTER';
    this.happiGraphData.graphDirection = 'HORIZONTAL';

    this.$.tokenAjax.url = '/api/lineage/entities/' + guid + '/source-and-destination?includeProcesses=' + includeProcesses;
    this.$.tokenAjax._go();
  }

  _reload(usecase, includeProcesses) {
    if (this.routeData.guid !== undefined
      && this.routeData.guid !== '')
      switch (usecase) {
        case 'ultimateSource':
<<<<<<< HEAD
=======
          this.graphLayout.hierarchical.direction = 'LR';

          this.happiGraphData.selectedNodePosition = 'LAST';
          this.happiGraphData.graphDirection = 'HORIZONTAL';
>>>>>>> c392729630... Refactor and update asset lineage component
          this._ultimateSource(this.routeData.guid, includeProcesses);

          break;
        case 'endToEnd':
<<<<<<< HEAD
=======
          this.graphLayout.hierarchical.direction = 'LR';

          this.happiGraphData.selectedNodePosition = 'CENTER';
          this.happiGraphData.graphDirection = 'HORIZONTAL';
>>>>>>> c392729630... Refactor and update asset lineage component
          this._endToEndLineage(this.routeData.guid, includeProcesses);

          break;
        case 'ultimateDestination':
<<<<<<< HEAD
          this._ultimateDestination(this.routeData.guid, includeProcesses);
          break;
        case 'verticalLineage':
=======
          this.graphLayout.hierarchical.direction = 'LR';

          this.happiGraphData.selectedNodePosition = 'FIRST';
          this.happiGraphData.graphDirection = 'HORIZONTAL';
          this._ultimateDestination(this.routeData.guid, includeProcesses);
          break;
        case 'verticalLineage':
          this.graphLayout.hierarchical.direction = 'DU';

          this.happiGraphData.selectedNodePosition = 'FIRST';
          this.happiGraphData.graphDirection = 'VERTICAL';
>>>>>>> c392729630... Refactor and update asset lineage component
          this._verticalLineage(this.routeData.guid, includeProcesses);

          break;
        case 'sourceAndDestination':
<<<<<<< HEAD
=======
          this.graphLayout.hierarchical.direction = 'LR';

          this.happiGraphData.selectedNodePosition = 'CENTER';
          this.happiGraphData.graphDirection = 'HORIZONTAL';
>>>>>>> c392729630... Refactor and update asset lineage component
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
}

window.customElements.define('asset-lineage-view', AssetLineageView);