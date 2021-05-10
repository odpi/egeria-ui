/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */
import { PolymerElement, html } from '@polymer/polymer';

import '../../old/shared-styles.js';
import '../asset-catalog/egeria-asset-tools.component';
import '@vaadin/vaadin-split-layout/vaadin-split-layout';
import '@vaadin/vaadin-button/vaadin-button.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-column.js';

import { egeriaFetch } from '../commons/fetch.js';
import { ENV } from '../../env';
import { updateBreadcrumb } from '../breadcrumb/egeria-breadcrumb-events';

class EgeriaGlossary extends PolymerElement {
  static get properties() {
    return {
      glossaries: { type: Array, value: [] },
      categories: { type: Array, value: [] },
      terms: { type: Array, value: [] }
    };
  }

  ready() {
    super.ready();

    updateBreadcrumb([
      {
        href: '/glossary',
        name: 'glossary view'
      }
    ]);

    egeriaFetch(`/api/glossaries`)
      .then(response => {
        this.glossaries = response;
      });

    egeriaFetch(`/api/glossaries/terms`)
      .then(response => {
        this.terms = response;
      });

    egeriaFetch(`/api/glossaries/categories`)
      .then(response => {
        this.categories = response;
      });
  }

  btoa(string) {
    return ENV['PRODUCTION'] ? string : window.btoa(string);
  }

  _activeItemChanged(event) {
    const item = event.detail.value;

    if (item) {
      this.$[event.target.id].selectedItems = item ? [ item ] : [];

      switch (event.target.id) {
        case 'glossaries':
          this._loadCategories(item.guid);
          break;
        case 'categories':
          this._loadTermsByCategory(item.guid);
          break;
        default:
          console.warn('NOT_FOUND');
      }
    }
  }

  _loadCategories(guid) {

  }

  _loadTermsByCategory(guid) {

  }

  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;
          margin:var(--egeria-view-margin);
          min-height: var(--egeria-view-min-height);
          --iron-icon-width:16px;
          --iron-icon-height:16px;
        }
        .grid-container {
          display: flex;
        }
        vaadin-grid{
          height: auto;
        }

        asset-tools {
          margin: 0;
          padding: 0;
          --asset-tools-li-padding: 2px;
        }

        .right {
          float: right;
        }
      </style>

      <vaadin-split-layout orientation="vertical" style="min-height: inherit">
        <vaadin-split-layout>
          <div class="grid-container">
            <vaadin-grid id="glossaries"
                         items="[[ glossaries ]]"
                         theme="row-stripes"
                         on-active-item-changed="_activeItemChanged"
                         column-reordering-allowed multi-sort>
              <vaadin-grid-column width="10em" resizable>
                <template class="header">
                  <vaadin-grid-sorter path="displayName">Glossary</vaadin-grid-sorter>
                </template>
                <template>
                  [[ item.displayName ]]
                </template>
              </vaadin-grid-column>

              <vaadin-grid-column width="5em" resizable>
                <template class="header">
                  <vaadin-grid-sorter path="status">Status</vaadin-grid-sorter>
                </template>
                <template>[[ item.status ]]</template>
              </vaadin-grid-column>

              <vaadin-grid-column width="10em" resizable>
                <template class="header">
                </template>
                <template>
                  <div class="right">
                    <a href="/asset-catalog/[[ btoa(item.guid) ]]/details" title="view details">
                      <iron-icon icon="vaadin:eye"></iron-icon>
                    </a>
                  </div>
                </template>
              </vaadin-grid-column>
            </vaadin-grid>
          </div>
          <div class="grid-container">
            <vaadin-grid id="categories"
                         items="[[categories]]"
                         theme="row-stripes"
                         on-active-item-changed="_activeItemChanged"
                         column-reordering-allowed
                         multi-sort
                         aria-label="Glosssary categories">
              <vaadin-grid-column width="10em" resizable>
                  <template class="header">
                    <vaadin-grid-sorter path="displayName">Category</vaadin-grid-sorter>
                  </template>

                  <template>[[ item.displayName ]]</template>
              </vaadin-grid-column>

              <vaadin-grid-column width="5em" resizable>
                <template class="header">
                  <vaadin-grid-sorter path="status">Status</vaadin-grid-sorter>
                </template>

                <template>[[ item.status ]]</template>
              </vaadin-grid-column>

              <vaadin-grid-column width="10em" resizable>
                <template class="header"></template>

                <template>
                  <div class="right">
                    <a href="/asset-catalog/[[ btoa(item.guid) ]]/details" title="view details">
                      <iron-icon icon="vaadin:eye"></iron-icon>
                    </a>
                  </div>
                </template>
              </vaadin-grid-column>
            </vaadin-grid>
          </div>
        </vaadin-split-layout>

        <div class="grid-container">
          <vaadin-grid id="terms"
                       items="[[ terms ]]"
                       theme="row-stripes"
                       on-active-item-changed="_activeItemChanged"
                       column-reordering-allowed multi-sort>
            <vaadin-grid-column width="10em" resizable>
              <template class="header">
                <vaadin-grid-sorter path="displayName">Glossary term</vaadin-grid-sorter>
              </template>

              <template>
                <a href="/asset-catalog/[[ btoa(item.guid) ]]/details">[[ item.displayName ]]</a>
              </template>
            </vaadin-grid-column>

            <vaadin-grid-column width="5em" resizable>
              <template class="header">
                <vaadin-grid-sorter path="status">Status</vaadin-grid-sorter>
              </template>

              <template>[[item.status]]</template>
            </vaadin-grid-column>

            <vaadin-grid-column width="5em" resizable>
              <template class="header"></template>
              <template>
                <egeria-asset-tools class="right" items="[[ item.typeDefName ]]" guid="[[ btoa(item.guid) ]]"></egeria-asset-tools>
              </template>
            </vaadin-grid-column>
          </vaadin-grid>
        </div>
      </vaadin-split-layout>
    `;
  }
}

window.customElements.define('egeria-glossary', EgeriaGlossary);
