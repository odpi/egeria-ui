/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-styles/paper-styles.js';
import '@polymer/paper-input/paper-input-behavior.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js';
import '@vaadin/vaadin-button/vaadin-button.js';
import '@vaadin/vaadin-select/vaadin-select';
import 'multiselect-combo-box/multiselect-combo-box.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-behavior/paper-dialog-behavior.js';

import {AppLocalizeBehavior} from "@polymer/app-localize-behavior/app-localize-behavior.js";
import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '../shared-styles.js';
import './asset-qualified-name-view.js';
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";


class AssetSearchView extends mixinBehaviors([AppLocalizeBehavior], PolymerElement) {

    static get properties() {
        return {
            q: {
                type: Object,
                notify: true,
            },
            from: {
                type: Number,
                value: 0
            },
            pageSize: {
                type: Number,
                value: 20,
            },
            currentPage: {
                type: Number,
                computed: '_computeCurrentPage(from,pageSize)'
            },
            items: {
                type: Array,
                observer: '_itemsChanged'
            },
            assets: {
                type: Array,
                value: [],
                notify: true
            },
            item: Object
        };
    }


    ready() {
        super.ready();
        this.$.tokenAjaxTypes.url = '/api/assets/types';
        this.$.tokenAjaxTypes._go();
    }

    _guidChanged() {
        console.log('guid changed');
    }

    _useCaseChanged() {
        console.log('usecase changed');
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
            this.dispatchEvent(new CustomEvent('show-modal', {
                bubbles: true,
                composed: true,
                detail: {message: "No more metadata to fetch for this criteria!", level: 'info'}
            }));
        } else {
            this.$.more.disabled = items === null;
        }
    }

    _validateSearch() {
        let validSearch = true;
        if (!this.$.searchField.validate()) {
            validSearch = false;
            this.dispatchEvent(new CustomEvent('show-modal', {
                bubbles: true,
                composed: true,
                detail: {message: "Search criteria minimum length is 2 characters !", level: 'error'}
            }));
        } else if (!this.$.combo.validate()) {
            validSearch = false;
            this.dispatchEvent(new CustomEvent('show-modal', {
                bubbles: true,
                composed: true,
                detail: {message: "Please select at least one Open Metadata Type !", level: 'error'}
            }));
        }
        return validSearch;
    }

    _goNext() {
        this.from += this.pageSize;
        this._fetch();
    }

    _goPrev() {
        if (this.currentPage > 1) {
            this.from -= this.pageSize;
            if (this.from < 0) this.from = 0;
            this._fetch();
        }
    }

    _computeCurrentPage(from, pageSize) {
        return Math.ceil(from / pageSize) + 1;
    }

    _search() {
        this.from = 0;
        this._fetch();
    }

    _pageSizeChanged(value) {
        this.pageSize = parseInt(value);
        this.from = 0;
        if (this.q && 0 !== this.q.trim().length) {
            this._fetch();
        }
    }

    _fetch() {
        if (this._validateSearch()) {
            var types = [];
            this.$.combo.selectedItems.forEach(function (item) {
                types.push(item.name);
            });
            this.$.tokenAjax.url = '/api/assets/search?q=' + this.q.trim()
                + '&types=' + types
                + '&exactMatch=' + this.$.exactMatch.checked
                + '&caseSensitive=' + this.$.caseSensitive.checked
            ;
            if (this.from > 0)
                this.$.tokenAjax.url += '&from=' + this.from;
            if (this.pageSize > 0)
                this.$.tokenAjax.url += '&pageSize=' + this.pageSize;
            this.$.tokenAjax._go();
        }
    }

    _itemName(item) {
        if (item.properties.displayName && item.properties.displayName != null)
            return item.properties.displayName;
        else if (item.properties.name && item.properties.name != null)
            return item.properties.name;
        else
            return 'N/A';
    }



    attached() {
        this.loadResources(
            // The specified file only contains the flattened translations for that language:
            'locales/' + this.language + '.json',  //e.g. for es {"hi": "hola"}
            this.language,               // unflatten -> {"es": {"hi": "hola"}}
            true                // merge so existing resources won't be clobbered
        );
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
                    min-height: var(--egeria-view-min-height);

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
                
                .form-content{
                    text-align: center;
                    margin: 20px;
                }
            </style>
            
            <token-ajax id="tokenAjax" last-response="{{items}}"></token-ajax>
            <token-ajax id="tokenAjaxTypes" last-response="{{supportedTypes}}"></token-ajax>


            <iron-form id="searchForm">
                <form method="get">
                    <iron-a11y-keys keys="enter" on-keys-pressed="_search"></iron-a11y-keys>
                    <div class="form-content"> 
                    
                        <paper-checkbox id="exactMatch">Exact match</paper-checkbox>
                        <paper-checkbox id="caseSensitive">Case sensitive</paper-checkbox>
                        <multiselect-combo-box class="multi-combo" id="combo" items="[[supportedTypes]]"
                                               item-label-path="name"
                                               ordered="false"
                                               placeholder="Open Metadata Type (required)"
                                               required
                                               error-message="Please select one">
                        </multiselect-combo-box>
                        <div>
                            <paper-input id="searchField"
                                         label="Search" value="{{q}}"
                                         no-label-float
                                         required
                                         minlength="2"
                                         autofocus>
                                <iron-icon icon="search" slot="prefix" id="searchFieldIcon"></iron-icon>
                            </paper-input>

                            <vaadin-button id="searchSubmit" theme="primary" on-tap="_search">
                                <iron-icon id="search" icon="search"></iron-icon>
                            </vaadin-button>
                        </div>
                    </div>
                </form>
            </iron-form>
            <vaadin-grid id="grid" items="[[assets]]" theme="row-stripes"
                         column-reordering-allowed multi-sort>
                <vaadin-grid-column width="20%" resizable>
                    <template class="header">
                        <div><vaadin-grid-sorter path="properties.displayName">Name</vaadin-grid-sorter></div>
                        <div><vaadin-grid-filter path="properties.displayName"></vaadin-grid-filter></div>
                    </template>
                    <template>
                        <a href="#/asset-catalog/view/[[item.guid]]">
                            [[_itemName(item)]]
                        </a>
                    </template>
                </vaadin-grid-column>

                <vaadin-grid-column width="10%" resizable>
                    <template class="header">
                        <div><vaadin-grid-sorter path="type.name">Type</vaadin-grid-sorter></div>
                        <div><vaadin-grid-filter path="type.name"></vaadin-grid-filter></div>
                    </template>
                    <template>[[item.type.name]]</template>
                </vaadin-grid-column>
                
                <vaadin-grid-column path="properties.qualifiedName" header="Context Info" width="40%" resizable>
                    <template class="header">
                        <div><vaadin-grid-sorter path="properties.qualifiedName">Context Info</vaadin-grid-sorter></div>
                        <div><vaadin-grid-filter path="properties.qualifiedName"></vaadin-grid-filter></div>
                    </template>
                    <template>
                        <asset-qualified-name-view qualified="[[ item.properties.qualifiedName ]]"></asset-qualified-name-view>
                    </template>
                </vaadin-grid-column>

                <vaadin-grid-column width="30%" resizable>
                    <template class="header">
                        <div><vaadin-grid-sorter path="properties.summary">Description</vaadin-grid-sorter></div>
                        <div><vaadin-grid-filter path="properties.summary"></vaadin-grid-filter></div>
                    </template>
                    <template>[[item.properties.summary]]</template>
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



window.customElements.define('asset-search-view', AssetSearchView);