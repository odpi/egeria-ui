/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */
import { PolymerElement, html } from '@polymer/polymer';

import './egeria-asset-search.component';
import './egeria-asset-details.component';

class EgeriaAssetCatalog extends PolymerElement {

  static get properties() {
    return {
      pages: { type: Array, value: [''], observer: '_pagesChanged' },
      nextPages: { type: Array, value: [''] },
      page: { type: String, value: '' },

      queryParams: { type: String, value: '' },

      guid: { type: String, value: '' },
      components: { type: Array, value: [] }
    }
  }

  _pagesChanged(newPages) {
    if(newPages && newPages.length >= 0) {
      const [removed, ...newArr] = this.pages;

      this.page = removed;
      this.nextPages = newArr;

      // This should be used for the search form
      // in egeria-asset-search
      this.queryParams = window.location.search;

      if(newPages.length > 1) {
        const [guid, ...currentPage] = this.pages;
        const [page, ...nextPages] = currentPage;

        this.guid = guid;
        this.page = page;
        this.nextPages = nextPages;
      }
    }
  }

  _isEqualTo(a, b) {
    return a === b;
  }

  static get template() {
    return html`
      <template is="dom-if" if="[[ _isEqualTo(page, 'details') ]]">
        <egeria-asset-details guid="[[ guid ]]"
                              pages="[[ nextPages ]]"
                              components="[[ components ]]"></egeria-asset-details>
      </template>

      <template is="dom-if" if="[[ _isEqualTo(page, 'search') ]]">
        <egeria-asset-search pages="[[ nextPages ]]"></egeria-asset-search>
      </template>
    `;
  }
}

window.customElements.define('egeria-asset-catalog', EgeriaAssetCatalog);
