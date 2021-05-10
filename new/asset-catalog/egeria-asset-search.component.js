/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */
import { PolymerElement, html } from '@polymer/polymer';


import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js';
import '@vaadin/vaadin-button/vaadin-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import 'multiselect-combo-box/multiselect-combo-box.js';

import './egeria-qualified-name.component';

import { egeriaFetch } from '../commons/fetch';
import { ENV } from '../../env';
import { updateBreadcrumb } from '../breadcrumb/egeria-breadcrumb-events';

class EgeriaAssetSearch extends PolymerElement {
  static get properties() {
    return {
      q: { type: Object, notify: true },
      from: { type: Number, value: 0 },
      pageSize: { type: Number, value: 20 },
      currentPage: { type: Number, computed: '_computeCurrentPage(from,pageSize)' },
      queryParams: { type: Object, value: {} },
      items: { type: Array, observer: '_itemsChanged' },
      assets: { type: Array, value: [], notify: true },
      item: { type: Object, value: {} },
      types: { type: Array, value: [] }
    }
  }

  ready() {
    super.ready();

    updateBreadcrumb([
      {
        href: '/asset-catalog/search',
        name: 'asset-catalog'
      },
      {
        href: '/asset-catalog/search',
        name: 'search'
      }
    ]);

    egeriaFetch(`/api/assets/types`)
      .then(data => {
        this.types = data;
      });

    window.location.search.replace('?','').split('&').map(q => {
      let data = q.split('=');

      this.queryParams[data[0]] = data[1];
    });

    this.$.exactMatch.checked = this.queryParams['exactMatch'] ? true : false;
    this.$.caseSensitive.checked = this.queryParams['caseSensitive'] ? true : false;
    this.q = this.queryParams['q'];
    this.q ? this.q = this.q.trim() : 0;
    this.$.combo.selectedItems = this.queryParams['types'] ? this.queryParams['types'].split(',').map(i => { return {name: i}}) : [];

    if(this.q && this.$.combo.selectedItems.length > 0) {
      this._fetch();
    }
  }

  _computeCurrentPage(from, pageSize) {
    return Math.ceil(from / pageSize) + 1;
  }

  _goNext() {
    this.from += this.pageSize;

    this._fetch();
  }

  _goPrev() {
    if (this.currentPage > 1) {
      this.from -= this.pageSize;

      if (this.from < 0) {
        this.from = 0;
      }

      this._fetch();
    }
  }

  _search() {
    this.from = 0;
    this._fetch();
  }

  _fetch() {
    if (this._validateSearch()) {
      let exactMatch = this.$.exactMatch.checked;
      let caseSensitive = this.$.caseSensitive.checked;
      let from = this.from;
      let pageSize = this.pageSize;
      let types = [];

      this.$.combo.selectedItems.forEach(function (item) {
        types.push(item.name);
      });

      let url = '/api/assets/search';

      url = `${url}?q=${ this.q.trim() }`;
      url = `${url}&types=${ types }`;
      url = `${url}&exactMatch=${ exactMatch }`;
      url = `${url}&caseSensitive=${ caseSensitive }`;

      if (this.from > 0) {
        url = `${url}&from=${from}`;
      }

      if (this.pageSize > 0) {
        url = `${url}&pageSize=${pageSize}`;
      }

      egeriaFetch(url)
        .then(data => {
          this.items = data;
        });
    }
  }

  _validateSearch() {
    let validSearch = true;

    if (!this.$.searchField.validate()) {
      validSearch = false;

      window.dispatchEvent(new CustomEvent('egeria-open-modal', {
        bubbles: true,
        composed: true,
        detail: {
          message: 'Search criteria minimum length is 2 characters !',
          level: 'error'
        }
      }));
    } else if (!this.$.combo.validate()) {
      validSearch = false;

      window.dispatchEvent(new CustomEvent('egeria-open-modal', {
        bubbles: true,
        composed: true,
        detail: {
          message: 'Please select at least one Open Metadata Type !',
          level: 'error'
        }
      }));
    }

    return validSearch;
  }

  _itemsChanged(items) {
    if (this.from > 0) {
      this.assets = [].concat(this.assets).concat(items);
      this.$.grid.scrollToIndex(this.assets.length - 1);
    } else {
      this.assets = [].concat(items);
    }

    if (items !== null && items.length === 0) {
      this.$.more.disabled = true;

      window.dispatchEvent(new CustomEvent('egeria-open-modal', {
        bubbles: true,
        composed: true,
        detail: {
          message: 'No more metadata to fetch for this criteria!',
          level: 'info'
        }
      }));
    } else {
      this.$.more.disabled = items === null;
    }
  }

  _itemName(item) {
    if (item.properties.displayName && item.properties.displayName != null) {
      return item.properties.displayName;
    } else if (item.properties.name && item.properties.name != null) {
      return item.properties.name;
    } else {
      return 'N/A';
    }
  }

  btoa(string) {
    return ENV['PRODUCTION'] ? string : window.btoa(string);
  }

  static get template() {
    return html`
      <custom-style>
        <style is="custom-style">
          paper-input.custom {
            --paper-input-container-input: {
              padding-left: 8px;
            };

            --paper-input-container-label: {
              padding: 0 8px;
            };

            --paper-input-container-input-invalid: {
              background: rgba(255, 0, 0, 0.2);
            }
          }
        </style>
      </custom-style>

      <style include="shared-styles">
        :host {
          display: flex;
          flex-flow: column;
          min-height: calc(100vh - 64px);
        }

        .multi-combo {
          min-width: 350px;
        }

        #search, #more {
          --iron-icon-fill-color: white;
        }

        vaadin-grid {
          flex-grow: 1;
        }

        paper-checkbox {
          align-self: center;
          border: 1px solid var(--egeria-primary-color);
          padding: 8px;

          --paper-checkbox-checked-color: var(--egeria-primary-color);
          --paper-checkbox-checked-ink-color: var(--egeria-primary-color);
          --paper-checkbox-unchecked-color: var(--egeria-secondary-color);
          --paper-checkbox-unchecked-ink-color: var(--egeria-secondary-color);
          --paper-checkbox-label-color: var(--egeria-primary-color);
          --paper-checkbox-label-spacing: 0;
          --paper-checkbox-margin: 3px 8px 3px 0;
        }

        paper-input {
          width: 300px;
          display: inline-block;
          text-align: left;
        }

        .align-center { text-align:center; }
        .m20 { margin: 20px; }
      </style>

      <iron-form id="searchForm">
        <form method="get">
          <iron-a11y-keys keys="enter" on-keys-pressed="_search"></iron-a11y-keys>

          <div class="align-center m20">

          <div>
            <paper-input id="searchField"
                          label="Search"
                          value="{{ q }}"
                          no-label-float
                          required
                          minlength="2"
                          autofocus>
                <iron-icon icon="search" slot="prefix" id="searchFieldIcon"></iron-icon>
            </paper-input>

            <vaadin-button id="searchSubmit" theme="primary" on-tap="_search">
              <iron-icon id="search" icon="search"></iron-icon>
            </vaadin-button>

            <multiselect-combo-box class="multi-combo" id="combo" items="[[ types ]]"
                                item-label-path="name"
                                ordered="false"
                                placeholder="Open Metadata Type (required)"
                                required
                                error-message="Please select one">
            </multiselect-combo-box>
          </div>

          <div>
            <paper-checkbox id="exactMatch">Exact match</paper-checkbox>
            <paper-checkbox id="caseSensitive">Case sensitive</paper-checkbox>
          </div>
          </div>
        </form>
      </iron-form>

      <vaadin-grid id="grid"
                  items="[[ assets ]]"
                  theme="row-stripes"
                  column-reordering-allowed
                  multi-sort>
        <vaadin-grid-column width="20%" resizable>
          <template class="header">
            <div><vaadin-grid-sorter path="properties.displayName">Name</vaadin-grid-sorter></div>
            <div><vaadin-grid-filter path="properties.displayName"></vaadin-grid-filter></div>
          </template>
          <template>
            <a href="/asset-catalog/[[ btoa(item.guid) ]]/details">
              [[ _itemName(item) ]]
            </a>
          </template>
        </vaadin-grid-column>

        <vaadin-grid-column width="10%" resizable>
          <template class="header">
            <div><vaadin-grid-sorter path="type.name">Type</vaadin-grid-sorter></div>
            <div><vaadin-grid-filter path="type.name"></vaadin-grid-filter></div>
          </template>
          <template>[[ item.type.name ]]</template>
        </vaadin-grid-column>

        <vaadin-grid-column path="properties.qualifiedName"
                            header="Context Info"
                            width="40%"
                            resizable>
          <template class="header">
            <div><vaadin-grid-sorter path="properties.qualifiedName">Context Info</vaadin-grid-sorter></div>
            <div><vaadin-grid-filter path="properties.qualifiedName"></vaadin-grid-filter></div>
          </template>
          <template>
            <egeria-qualified-name qualified="[[ item.properties.qualifiedName ]]"></egeria-qualified-name>
          </template>
        </vaadin-grid-column>

        <vaadin-grid-column width="30%" resizable>
          <template class="header">
            <div><vaadin-grid-sorter path="properties.summary">Description</vaadin-grid-sorter></div>
            <div><vaadin-grid-filter path="properties.summary"></vaadin-grid-filter></div>
          </template>
          <template>[[ item.properties.summary ]]</template>
        </vaadin-grid-column>
      </vaadin-grid>

      <div style="display: flex">
        <div style="margin: auto">
          <vaadin-button id="more" on-click="_goNext" theme="primary">
            <iron-icon icon="vaadin:cloud-download-o" slot="prefix"></iron-icon>

            Load more ( [[assets.length]] )
          </vaadin-button>
        </div>
      </div>
    `;
  }
}

window.customElements.define('egeria-asset-search', EgeriaAssetSearch);
