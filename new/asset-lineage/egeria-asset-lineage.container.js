/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class';
import { EgeriaItemUtilsBehavior } from '../commons/egeria-item-utils.behaviour';

import '@polymer/paper-tabs/paper-tabs';
import '@polymer/paper-tabs/paper-tab';
import '@polymer/paper-dialog/paper-dialog';
import '@vaadin/vaadin-tabs/vaadin-tabs.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';

import { RoleComponentsBehavior } from '../../old/common/role-components';
import '../commons/egeria-props-table.component';

import './egeria-asset-lineage-viewer.component';
import '../asset-catalog/egeria-asset-tools.component';

import { egeriaFetch } from '../commons/fetch';
import { ENV } from '../../env';
import { updateBreadcrumb } from '../breadcrumb/egeria-breadcrumb-events';

class EgeriaAssetLineage extends mixinBehaviors([EgeriaItemUtilsBehavior, RoleComponentsBehavior], PolymerElement) {
  static get properties() {
    return {
      pages: { type: Array, observer: '_pagesChanged' },
      nextPages: { type: Array, value: [''] },
      page: { type: String, value: '' },
      hasVerticalTab: { type: Boolean, value: false },

      guid: { type: String, value: null },
      includeProcesses: { type: Boolean, value: true },
      graphData: { type: Object, value: null },
      selectedNode: { type: Object, value: null },
      selectedNodeDetails: { type: Object, value: null },
      queryParams: { type: Array, value: [] },
      toggleETLJobs: { type: Boolean, value: true },
      typeMapData: {
        type: Object,
        value: {}
      },
      graphMappings: {
        type: Object,
        value: {}
      },

      pageList: {
        type: Object,
        value: [
          {
            name: 'ultimate-source',
            apiSuffix: 'ultimate-source'
          },
          {
            name: 'end-to-end',
            apiSuffix: 'end2end'
          },
          {
            name: 'ultimate-destination',
            apiSuffix: 'ultimate-destination'
          },
          {
            name: 'vertical-lineage',
            apiSuffix: 'vertical-lineage'
          },
          {
            name: 'repository-explorer',
            apiSuffix: ''
          }
        ]
      }
    };
  }

  atob(string) {
    return ENV['PRODUCTION'] ? string : window.atob(string);
  }

  _pagesChanged(newPages) {
    if(newPages) {
      if(newPages.length > 1) {
        const [guid, ...currentPage] = this.pages;
        const [page, ...nextPages] = currentPage;

        this.guid = guid;

        this.decodedGuid = this.atob(guid);

        if(window.location.search !== '') {
          window.location.search.replace('?', '').split('&').map(q => {
            let data = q.split('=');

            this.queryParams.push({
              key: data[0],
              value: data[1]
            });
          });
        }

        const includeProcesses = this.queryParams.filter(d => d.key === 'includeProcesses').pop();
        if(includeProcesses) {
          this.toggleETLJobs = includeProcesses.value === 'true';
        }

        this.page = page;
        this.nextPages = nextPages;

        if(![
          'ultimate-source',
          'end-to-end',
          'ultimate-destination',
          'vertical-lineage',
          'repository-explorer'
        ].includes(page)) {
          window.location.href = '/error';
        } else {
          Promise.all([
            this.setSelectedNode(),
            this.fetchGraphData(),
          ]).then((responses) => {
            let [ selectedNodeDetails, data] = responses;

            this.updateData(data);
            this.updateSelectedNode(selectedNodeDetails);

            updateBreadcrumb([
              { href: null, name: 'asset-lineage' },
              {
                href: `/asset-catalog/${ this.guid }/details`,
                name: this._fallbackDisplayName( selectedNodeDetails )
              },
              { href: `/asset-lineage/${ this.guid }/${ this.page }`, name: this.page }
            ]);
          });
        }
      } else {
        window.location.href = '/error';
      }
    }
  }

  setSelectedNode() {
    return egeriaFetch(`/api/assets/${ this.atob(this.guid) }`);
  }

  updateSelectedNode(selectedNodeDetails) {
    this.selectedNodeDetails = selectedNodeDetails;

    this.checkForVerticalTab(this.selectedNodeDetails);
  }

  fetchGraphData() {
    let pathSuffix = this.pageList
                .filter(p => p.name === this.page)
                .pop()
                .apiSuffix;

    this.graphData = null;

    return egeriaFetch(`/api/lineage/entities/${ this.atob( this.guid ) }/${ pathSuffix }?includeProcesses=${ this.toggleETLJobs }`);
  }

  updateData(data) {
    this.checkLineage(data);

    this.graphData = {
      nodes: [ ...data.nodes ],
      links: [ ...data.edges ],
      selectedNodeId: this.decodedGuid
    };
  }

  hasGraphData(graphData) {
    return graphData !== null;
  }

  checkLineage(graphData) {
    if (graphData === null || graphData.nodes.length === 0) {
      let evt = new CustomEvent('egeria-open-modal', {
        detail: {
          message: 'No lineage information available.'
        },
        bubbles: true,
        composed: true
      });

      window.dispatchEvent(evt);

      console.log('No lineage information available.');
    }
  }

  checkForVerticalTab(selectedNodeDetails) {
    this.hasVerticalTab = [
      'RelationalColumn',
      'TabularColumn',
      'GlossaryTerm'
    ].includes(selectedNodeDetails && selectedNodeDetails.type ? selectedNodeDetails.type.name : '');
  }

  _isEqualTo(a, b) {
    return a === b;
  }

  ready() {
    super.ready();

    window.addEventListener('happi-graph-on-node-click', e => {
      this.onNodeClick(e.detail);
    });

    window.addEventListener('happi-graph-on-cached-graph', e => {
      this.fetchGraphData().then((response) => {this.updateData(response)})
    });

    window.addEventListener('egeria-toggle-statistics', e => {
      this.toggleStatistics();
    });

    window.addEventListener('egeria-toggle-graph-list', e => {
      this.showGraphList();
    });

    window.addEventListener('egeria-toggle-etl-jobs', e => {
      this.onToggleETLJobs();
    });
  }

  onToggleETLJobs() {
    const includeProcesses = this.queryParams.filter(d => d.key === 'includeProcesses').pop();

    if(!includeProcesses) {
      this.queryParams.push({key: 'includeProcesses', value: this.toggleETLJobs});
    }

    this.toggleETLJobs = !this.toggleETLJobs;

    this.queryParams = this.queryParams.map(d => {
      if(d.key === 'includeProcesses') {
        d.value = `${this.toggleETLJobs}`;
      }

      return d;
    });

    const url = window.location.protocol
                + '//' + window.location.host
                + window.location.pathname
                + '?'
                + this.queryParams.map(s => `${s.key}=${s.value}`).join('&');

    window.history.replaceState({
      path: url
    }, '', url);

    this.fetchGraphData().then((response) => {this.updateData(response)});
  }

  onNodeClick({ nodeId }) {
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

  toggleStatistics() {
    this.showStatistics();
  }

  showStatistics() {
    let _nodes = this.graphData.nodes;

    let typeMap = {};

    if(_nodes.length) {
      _nodes.map(n => {
        if(typeMap[n.group]) {
          typeMap[n.group]++;
        } else {
          typeMap[n.group] = 1;
        }
      });

      this.typeMapData = [
        ...Object.keys(typeMap).map(k => {
          return {
            key: k,
            occurrences: typeMap[k]
          };
        })
      ];
    } else {
      this.typeMapData = [];
    }

    this.shadowRoot.querySelector('#paper-dialog-statistics').open();
  }

  showGraphList() {
    let _nodes = this.graphData.nodes;
    let _links = this.graphData.links;

    if(_links.length) {

      this.graphMappings = [
        ...Object(_links).map(e => {
          let fromNode = _nodes
              .filter(n => n.id === e.from)
              .pop();
          let toNode = _nodes
              .filter(n => n.id === e.to)
              .pop();
          return {
            from: fromNode,
            mapping: e.label,
            to: toNode
          };
        })
      ];

    } else {
      this.graphMappings = [];
    }

    this.shadowRoot.querySelector('#paper-dialog-relations').open();
  }

  highlightClass( id ){
    return id === this.graphData.selectedNodeId ? 'highlight' : '';
  }

  _exportCSV(){

    let csvContent = "data:text/csv;charset=utf-8,"
        + ['from','from-type','mapping','target','target-type'].toString() + ('\n')
        + this.createCSVContent(this.graphMappings);

    var encodedUri = encodeURI(csvContent);

    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", this.graphData.selectedNodeId + ".csv");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file

    document.body.removeChild(link);
  }

  createCSVContent(arr) {
    const array = [...arr];

    return array.map(it => {
      return it.from.label + ',' + it.from.group + ','
              + it.mapping + ','
              + it.to.label + ',' + it.to.group;
    }).join('\n');
  }


  static get template() {
    return html`
      <style>
        :root {
          --paper-tab-ink: var(--egeria-primary-color);
          --paper-tabs-selection-bar-color: var(--egeria-primary-color);
        }

        :host {
          display:block;
          height:calc(100% - 48px);
        }

        paper-tab {
          padding:0;
        }

        paper-tab a {
          color: #000;
          text-decoration:none;
          font-weight:normal;

          display:flex;
          align-items: center;
          justify-content: center;

          height: 100%;
        }

        .local-wrapper {
          width:1024px;
        }

        .pull-right {
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }
        
        .flex-box {
          display: flex;
          flex: 1;
          align-items: center;
        }
        
        .highlight {
          color:  var(--egeria-primary-color);
          font-style: italic;
          font-weight: bold;
        }
        
      </style>


      <div style="height:100%;">
        <template is="dom-if" if="[[ hasGraphData(graphData) ]]" restamp="true">
          <paper-tabs attr-for-selected="name" selected="{{ page }}">

            <template is="dom-if" if="[[ _hasComponent('ultimate-source') ]]">
              <paper-tab name="ultimate-source">
                <a name="ultimate-source" href="/asset-lineage/[[ guid ]]/ultimate-source">
                  <span>Ultimate Source</span>
                </a>
              </paper-tab>
            </template>

            <template is="dom-if" if="[[ _hasComponent('end-to-end') ]]">
              <paper-tab name="end-to-end">
                <a href="/asset-lineage/[[ guid ]]/end-to-end">
                  <span>End to end</span>
                </a>
              </paper-tab>
            </template>

            <template is="dom-if" if="[[ _hasComponent('ultimate-destination') ]]">
              <paper-tab name="ultimate-destination">
                <a href="/asset-lineage/[[ guid ]]/ultimate-destination">
                  <span>Ultimate Destination</span>
                </a>
              </paper-tab>
            </template>

            <template is="dom-if" if="[[ _hasComponent('vertical-lineage') ]]">
              <template is="dom-if" if="[[ hasVerticalTab ]]">
                <paper-tab name="vertical-lineage">
                  <a href="/asset-lineage/[[ guid ]]/vertical-lineage">
                    <span>Vertical Lineage</span>
                  </a>
                </paper-tab>
              </template>
            </template>
          </paper-tabs>

          <template is="dom-if" if="[[ _isEqualTo(page, 'ultimate-source') ]]">
            <egeria-asset-lineage-viewer has-vertical-tab="[[ !hasVerticalTab ]]"
                                         graph-data="[[ graphData ]]"
                                         graph-direction="HORIZONTAL"
                                         toggle-etl-jobs="[[ toggleETLJobs ]]"></egeria-asset-lineage-viewer>
          </template>

          <template is="dom-if" if="[[ _isEqualTo(page, 'end-to-end') ]]">
            <egeria-asset-lineage-viewer has-vertical-tab="[[ hasVerticalTab ]]"
                                         graph-direction="HORIZONTAL"
                                         graph-data="[[ graphData ]]"
                                         toggle-etl-jobs="[[ toggleETLJobs ]]"></egeria-asset-lineage-viewer>
          </template>

          <template is="dom-if" if="[[ _isEqualTo(page, 'ultimate-destination') ]]">
            <egeria-asset-lineage-viewer has-vertical-tab="[[ !hasVerticalTab ]]"
                                         graph-direction="HORIZONTAL"
                                         graph-data="[[ graphData ]]"
                                         toggle-etl-jobs="[[ toggleETLJobs ]]"></egeria-asset-lineage-viewer>
          </template>

          <template is="dom-if" if="[[ _isEqualTo(page, 'vertical-lineage') ]]">
            <egeria-asset-lineage-viewer has-vertical-tab="[[ hasVerticalTab ]]"
                                         graph-direction="VERTICAL"
                                         graph-data="[[ graphData ]]"
                                         toggle-etl-jobs="[[ toggleETLJobs ]]"></egeria-asset-lineage-viewer>
          </template>

          <template is="dom-if" if="[[ _isEqualTo(page, 'repository-explorer') ]]">
            'repository-explorer'
            <!-- nextPages -> [omas.serverName, omas.baseUrl] -->

            repository-explorer
          </template>

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

              <egeria-asset-tools type="[[ selectedNode.group ]]"
                          guid="[[ selectedNode.id ]]"
                          components="[[ components ]]
                          on-button-click="_closeDialog"
                          style="display: inline-flex"></egeria-asset-tools>

              <template is="dom-if" if="[[ selectedNode ]]">
                <egeria-props-table items="[[ _getPropertiesForDisplay(selectedNode) ]]" title="Properties" with-row-stripes></egeria-props-table>

                <template is="dom-if" if="[[ hasSize(selectedNode.properties) ]]" restramp="true">
                  <egeria-props-table items="[[ _attributes(selectedNode.properties )]]" title="Context" with-row-stripes></egeria-props-table>
                </template>
              </template>
              <div></div>
            </div>
          </paper-dialog>

          <paper-dialog id="paper-dialog-statistics"
                        class="paper-dialog-statistics"
                        allow-click-through="[[ false ]]">
            <div class="local-wrapper">
              <div class="pull-right">
                <h3 class="flex-box">Graph statistics</h3>
                <paper-icon-button dialog-confirm icon="icons:close"></paper-icon-button>
              </div>

              <!-- extract this to separate component -->
              <vaadin-grid id="statistics-grid" items="[[ typeMapData ]]" theme="row-stripes">
                <vaadin-grid-column width="70%">
                  <template class="header">
                      <div>
                        <vaadin-grid-sorter path="key">Type</vaadin-grid-sorter>
                      </div>
                  </template>
                  <template>
                      [[ item.key ]]
                  </template>
                </vaadin-grid-column>

                <vaadin-grid-column width="30%">
                  <template class="header">
                      <div>
                        <vaadin-grid-sorter path="occurrences">Occurrences</vaadin-grid-sorter>
                      </div>
                  </template>
                  <template>[[ item.occurrences ]]</template>
                </vaadin-grid-column>
              </vaadin-grid>
            </div>
          </paper-dialog>

          <paper-dialog id="paper-dialog-relations"
                        class="paper-dialog-relations"
                        allow-click-through="[[ false ]]">
            <div class="local-wrapper">
              <div class="pull-right">
                <div class="flex-box">
                    <h3>List of graph relations</h3>
                    <paper-icon-button icon="icons:file-download" on-click="_exportCSV"></paper-icon-button>
                </div>
                <paper-icon-button dialog-confirm icon="icons:close"></paper-icon-button>
              </div>

              
              <!-- extract this to separate component -->
              <vaadin-grid id="statistics-grid" items="[[ graphMappings ]]" theme="row-stripes">
                <vaadin-grid-column >
                  <template class="header">
                    <div>
                      <vaadin-grid-sorter path="from.label">Source</vaadin-grid-sorter>
                    </div>
                    <div>
                      <vaadin-grid-filter path="from.label"></vaadin-grid-filter>
                    </div>
                  </template>
                  <template>
                    <div class$="[[ highlightClass( item.from.id ) ]]">
                        [[ item.from.label ]]
                    </div>
                  </template>
                </vaadin-grid-column>

                <vaadin-grid-column >
                  <template class="header">
                    <div>
                      <vaadin-grid-sorter path="from.group">Source type</vaadin-grid-sorter>
                    </div>
                    <div>
                      <vaadin-grid-filter path="from.group"></vaadin-grid-filter>
                    </div>
                  </template>
                  <template>
                    <div class$="[[ highlightClass( item.from.id ) ]]">
                        [[ item.from.group ]]
                    </div>
                  </template>
                </vaadin-grid-column>

                <vaadin-grid-column >
                  <template class="header">
                    <div>
                      <vaadin-grid-sorter path="mapping">Mapping</vaadin-grid-sorter>
                    </div>
                    <div>
                      <vaadin-grid-filter path="mapping"></vaadin-grid-filter>
                    </div>
                  </template>
                  <template>
                    [[ item.mapping ]]
                  </template>
                </vaadin-grid-column>

                <vaadin-grid-column>
                  <template class="header">
                    <div>
                      <vaadin-grid-sorter path="to.label">Target</vaadin-grid-sorter>
                    </div>
                    <div>
                      <vaadin-grid-filter path="to.label"></vaadin-grid-filter>
                    </div>
                  </template>
                  <template>
                    <div class$="[[ highlightClass( item.to.id ) ]]">
                      [[ item.to.label ]]
                    </div>
                  </template>
                </vaadin-grid-column>

                <vaadin-grid-column>
                  <template class="header">
                    <div>
                      <vaadin-grid-sorter path="to.group">Target type</vaadin-grid-sorter>
                    </div>
                    <div>
                      <vaadin-grid-filter path="to.group"></vaadin-grid-filter>
                    </div>
                  </template>
                  <template>
                    <div class$="[[ highlightClass( item.to.id ) ]]">
                      [[ item.to.group ]]
                    </div>
                  </template>
                </vaadin-grid-column>
                
              </vaadin-grid>
            </div>
          </paper-dialog>
        </template>
      </div>
    `;
  }
}

window.customElements.define('egeria-asset-lineage', EgeriaAssetLineage);
