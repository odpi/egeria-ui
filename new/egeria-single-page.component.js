/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';

import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';

import '@polymer/iron-selector/iron-selector.js';
import '@polymer/iron-localstorage/iron-localstorage';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-form/iron-form.js';
import '@vaadin/vaadin-icons/vaadin-icons.js';
import '@polymer/paper-styles/paper-styles.js';

import '../src/my-icons.js';
import '../src/token-ajax';
import '../src/toast-feedback';
import '../src/shared-styles.js';

import './egeria-login.component';
import './asset-catalog-latest/egeria-asset-catalog.container';
import './asset-lineage/egeria-asset-lineage.container';
import './egeria-about.component';
import './egeria-user-options.component';

class EgeriaSinglePage extends PolymerElement {
  static get properties() {
    return {
      language: {
        value: 'en'
      },

      components: { type: Array, value: null },
      currentUser: { type: Object, value: {} },
      appInfo: { type: Object, value: {} },
      roles: { type: Array, value: [] },
      isLoggedIn: { type: Boolean, value: false },

      pages: { type: Array, value: [''], observer: '_pagesChanged' },
      nextPages: { type: Array, value: [''] },
      page: { type: String, value: '' },

      queryParams: { type: String, value: '' }
    }
  }

  _pagesChanged(newPages) {
    if(newPages && newPages.length >= 0) {
      const [removed, ...newArr] = this.pages;

      this.page = removed;
      this.nextPages = newArr;
    }
  }

  _toggleDrawer() {
    var dL = this.shadowRoot.querySelector('#drawerLayout');
    if (dL.forceNarrow || !dL.narrow) {
      dL.forceNarrow = !dL.forceNarrow;
    } else {
      dL.drawer.toggle();
    }
  }

  _isEqualTo(a, b) {
    return a === b;
  }

  _hasComponent(array, component) {
    if(array.length === 0) {
      return true;
    }

    return Array.isArray(array) && (array.includes("*") || array.includes(component));
  }

  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display:block;
          height:100%;
        }

        app-drawer-layout:not([narrow]) [drawer-toggle] {
          display: none;
        }

        app-toolbar {
          color: #fff;
          background-color: var(--egeria-primary-color);
        }

        app-header paper-icon-button {
          --paper-icon-button-ink-color: var(--egeria-button-ink-color);
          --iron-icon-fill-color: var(--egeria-button-ink-color);
        }

        app-header-layout {
          height:100%;
        }

        .drawer-list a {
          display: block;
          padding: 0 16px;
          text-decoration: none;
          color: var( --egeria-secondary-color );
          line-height: 40px;
        }

        .drawer-list div:not(.iron-selected) a:hover {
          background-color: var(--app-background-color);
        }

        .drawer-list div.iron-selected a {
          color: white;
        }

        .drawer-list-selected,
        .drawer-list div.iron-selected {
          font-weight: bold;
          color: var(--egeria-secondary-color);
          background-color: var(--egeria-primary-color);
        };

        paper-input.custom:hover {
          border: 1px solid #29B6F6;
        }

        paper-input.custom {
          margin-bottom: 14px;
          --primary-text-color: #01579B;
          --paper-input-container-color: black;
          --paper-input-container-focus-color: black;
          --paper-input-container-invalid-color: black;
          border: 1px solid #BDBDBD;
          border-radius: 5px;


          --paper-input-container: { padding: 0;};
          --paper-input-container-underline: { display: none; height: 0;};
          --paper-input-container-underline-focus: { display: none; };


          --paper-input-container-input: {
            box-sizing: border-box;
            font-size: inherit;
            padding: 4px;
          }

          --paper-input-container-input-focus: {
            background: rgba(0, 0, 0, 0.1);
          }

          --paper-input-container-input-invalid: {
            background: rgba(255, 0, 0, 0.3);
          }

          --paper-input-container-label: {
            top: -8px;
            left: 4px;
            background: white;
            padding: 2px;
            font-weight: bold;
          }

          --paper-input-container-label-floating: {
            width: auto;
        }

        .yellow-button {
            text-transform: none;
            color: #eeff41;
          }
        }

        .user-options {
          position:absolute;
          bottom:0;
        }

        .content {
          height:var(--egeria-view-min-height);
          margin:var(--egeria-view-margin);
        }
      </style>

      <app-drawer-layout id="drawerLayout"
                        flex
                        forceNarrow
                        narrow="{{ narrow }}"
                        fullbleed="">
        <app-drawer id="drawer"
                    slot="drawer"
                    swipe-open="[[ narrow ]]">
          <div id="logo"></div>

          <iron-selector selected="[[page]]"
                        attr-for-selected="name"
                        class="drawer-list"
                        swlectedClass="drawer-list-selected"
                        role="navigation">

            <template id="test" is="dom-if" if="[[components]]">
              <template is="dom-if" if="[[_hasComponent(components, 'asset-catalog')]]">
                <div name="asset-catalog" language="[[language]]"><a href="/asset-catalog/search">Asset Catalog</a></div>
              </template>
              <template is="dom-if" if="[[_hasComponent(components, 'glossary-view')]]">
                <div name="glossary" language="[[ language ]]"><a href="/glossary">Glossary View</a></div>
              </template>
              <template is="dom-if" if="[[_hasComponent(components, 'tex')]]">
                <div name="type-explorer"><a href="/type-explorer">Type Explorer</a></div>
              </template>
              <template is="dom-if" if="[[ _hasComponent(components, 'rex') ]]">
                <div name="repository-explorer"><a href="/repository-explorer">Repository Explorer</a></div>
              </template>
              <template is="dom-if" if="[[ _hasComponent(components, 'about') ]]">
                <div name="about"><a href="/about">About</a></div>
              </template>
            </template>
          </iron-selector>

          <div class="user-options-wrapper">
            <div class="user-options">
              <egeria-user-options></egeria-user-options>
            </div>
          </div>
        </app-drawer>

        <div class="content">
          <template is="dom-if" if="[[ _isEqualTo(page, 'asset-catalog') ]]">
            <egeria-asset-catalog pages="[[ nextPages ]]"
                                  components="[[ components ]]"></egeria-asset-catalog>
          </template>

          <template is="dom-if" if="[[ _isEqualTo(page, 'asset-lineage') ]]">
            <egeria-asset-lineage pages="[[ nextPages ]]"></egeria-asset-lineage>
          </template>

          <template is="dom-if" if="[[ _isEqualTo(page, 'glossary') ]]">
            <h3>glossary</h3>
          </template>

          <template is="dom-if" if="[[ _isEqualTo(page, 'type-explorer') ]]">
            <h3>type-explorer</h3>
          </template>

          <template is="dom-if" if="[[ _isEqualTo(page, 'repository-explorer') ]]">
            <h3>repository-explorer</h3>
          </template>

          <template is="dom-if" if="[[ _isEqualTo(page, 'about') ]]">
            <egeria-about></egeria-about>
          </template>
        </div>
      </app-drawer-layout>
    `;
  }
}

window.customElements.define('egeria-single-page', EgeriaSinglePage);
