/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import '@polymer/paper-tabs/paper-tabs';
import '@polymer/paper-tabs/paper-tab';

import '@vaadin/vaadin-tabs/vaadin-tabs.js';

import './egeria-asset-lineage-viewer.component';

import { ENV } from '../../env';
import { getCookie } from '../commons/cookies';

class EgeriaAssetLineage extends PolymerElement {
  getApiUrl() {
    return ENV['API_URL']
  }

  static get properties() {
    return {
      pages: { type: Array, observer: '_pagesChanged' },
      nextPages: { type: Array, value: [''] },
      page: { type: String, value: '' },
      hasVerticalTab: { type: Boolean, value: false },

      guid: { type: String, value: null },
      includeProcesses: { type: Boolean, value: true },
      graphData: { type: Object, value: null },

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
            name: 'source-and-destination',
            apiSuffix: 'source-and-destination'
          },
          {
            name: 'repository-explorer',
            apiSuffix: ''
          }
        ]
      }
    };
  }

  _pagesChanged(newPages) {
    if(newPages) {
      if(newPages.length > 1) {
        const [guid, ...currentPage] = this.pages;
        const [page, ...nextPages] = currentPage;

        this.guid = guid;

        this.decodedGuid = window.atob(guid);

        this.page = page;
        this.nextPages = nextPages;

        if(![
          'ultimate-source',
          'end-to-end',
          'ultimate-destination',
          'vertical-lineage',
          'source-and-destination',
          'repository-explorer'
        ].includes(page)) {
          window.location.href = '/error';
        } else {
          this.fetchGraphData();
        }
      } else {
        window.location.href = '/error';
      }
    }
  }

  fetchGraphData() {
    let pathSuffix = this.pageList
                .filter(p => p.name === this.page)
                .pop()
                .apiSuffix;

    this.graphData = null;

    return fetch(
        `${ this.getApiUrl() }/api/lineage/entities/${ window.atob( this.guid ) }/${ pathSuffix }?includeProcesses=true`,
        {
          headers: {
            'content-type': 'application/json',
            'x-auth-token': getCookie('token')
          }
        }
      )
      .then(data => data.json())
      .then(data => {
        this.checkLineage(data);
        this.checkForVerticalTab(data.nodes);

        this.graphData = {
          nodes: [ ...data.nodes ],
          links: [ ...data.edges ],
          selectedNodeId: this.decodedGuid
        };
      });
  }

  hasGraphData(graphData) {
    return graphData !== null;
  }

  checkLineage(graphData) {
    if (graphData === null || graphData.nodes.length === 0) {
      console.log('No lineage information available.');
    }
  }

  checkForVerticalTab(nodes) {
    this.hasVerticalTab = true;

    return;

    let selectedNode = nodes.filter((n) => {
      return n.id === this.decodedGuid;
    }).pop();

    if(selectedNode) {
      this.hasVerticalTab = [
        'RelationalColumn',
        'TabularColumn',
        'GlossaryTerm'
      ].includes(selectedNode.group);
    } else {
      return false;
    }
  }

  _isEqualTo(a, b) {
    return a === b;
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
          height:100%;
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
      </style>


      <div style="height:100%;">
        <template is="dom-if" if="[[ hasGraphData(graphData) ]]" restamp="true">
          <paper-tabs attr-for-selected="name" selected="{{ page }}">
            <paper-tab name="ultimate-source">
              <a name="ultimate-source" href="/asset-lineage/[[ guid ]]/ultimate-source">
                <span>Ultimate Source</span>
              </a>
            </paper-tab>
            <paper-tab name="end-to-end">
              <a href="/asset-lineage/[[ guid ]]/end-to-end">
                <span>End to end</span>
              </a>
            </paper-tab>
            <paper-tab name="ultimate-destination">
              <a href="/asset-lineage/[[ guid ]]/ultimate-destination">
                <span>Ultimate Destination</span>
              </a>
            </paper-tab>

            <template is="dom-if" if="[[ hasVerticalTab ]]">
              <paper-tab name="vertical-lineage">
                <a href="/asset-lineage/[[ guid ]]/vertical-lineage">
                  <span>Vertical Lineage</span>
                </a>
              </paper-tab>
            </template>

            <paper-tab name="source-and-destination">
              <a href="/asset-lineage/[[ guid ]]/source-and-destination">
                <span>Source and Destination</span>
              </a>
            </paper-tab>
          </paper-tabs>

          <template is="dom-if" if="[[ _isEqualTo(page, 'ultimate-source') ]]">
            <egeria-asset-lineage-viewer graph-data="[[ graphData ]]"
                                         graph-direction="HORIZONTAL"></egeria-asset-lineage-viewer>
          </template>

          <template is="dom-if" if="[[ _isEqualTo(page, 'end-to-end') ]]">
            <egeria-asset-lineage-viewer graph-direction="HORIZONTAL"
                                         graph-data="[[ graphData ]]"></egeria-asset-lineage-viewer>
          </template>

          <template is="dom-if" if="[[ _isEqualTo(page, 'ultimate-destination') ]]">
            <egeria-asset-lineage-viewer graph-direction="HORIZONTAL"
                                         graph-data="[[ graphData ]]"></egeria-asset-lineage-viewer>
          </template>

          <template is="dom-if" if="[[ _isEqualTo(page, 'vertical-lineage') ]]">
            <egeria-asset-lineage-viewer graph-direction="VERTICAL"
                                         graph-data="[[ graphData ]]"></egeria-asset-lineage-viewer>
          </template>

          <template is="dom-if" if="[[ _isEqualTo(page, 'source-and-destination') ]]">
            <egeria-asset-lineage-viewer graph-direction="HORIZONTAL"
                                         graph-data="[[ graphData ]]"></egeria-asset-lineage-viewer>
          </template>

          <template is="dom-if" if="[[ _isEqualTo(page, 'repository-explorer') ]]">
            'repository-explorer'
            <!-- nextPages -> [omas.serverName, omas.baseUrl] -->

            repository-explorer
          </template>
        </template>
      </div>
    `;
  }
}

window.customElements.define('egeria-asset-lineage', EgeriaAssetLineage);
