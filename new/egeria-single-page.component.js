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
import '@polymer/paper-dialog/paper-dialog';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';

import { RoleComponentsBehavior } from '../old/common/role-components';
import '../old/my-icons.js';
import '../old/shared-styles.js';

import './breadcrumb/egeria-breadcrumb.component';
import './egeria-spinner.component';
import './egeria-login.component';
import './asset-catalog/egeria-asset-catalog.container';
import './asset-lineage/egeria-asset-lineage.container';
import './egeria-about.component';
import './egeria-user-options.component';
import './glossary/egeria-glossary.component';
import './type-explorer/egeria-type-explorer.component';
import './repository-explorer/egeria-repository-explorer.component';

class EgeriaSinglePage extends mixinBehaviors(RoleComponentsBehavior, PolymerElement) {
  static get properties() {
    return {
      language: {
        value: 'en'
      },

      currentUser: { type: Object, value: {} },
      appInfo: { type: Object, value: {} },
      roles: { type: Array, value: [] },
      isLoggedIn: { type: Boolean, value: false },

      pages: { type: Array, value: [''], observer: '_pagesChanged' },
      nextPages: { type: Array, value: [''] },
      page: { type: String, value: '' },

      queryParams: { type: String, value: '' },

      modalMessage: { type: String, value: '' },

      crumbs: { type: Array, value: [] }
    }
  }


  beforePageChange() {
    let popup = this.shadowRoot.querySelector('#fullscreen-popup')
    if (popup) {
      let isOpen = popup.opened;
      if (isOpen) {
        let assetLineage = this.shadowRoot.querySelector('#asset-lineage');
        let content = this.shadowRoot.querySelector('#content');
        content.appendChild(assetLineage);
      }
    }
  }

  _pagesChanged(newPages) {
    if(newPages && newPages.length >= 0) {
      const [removed, ...newArr] = this.pages;

      this.page = removed;
      this.nextPages = newArr;
      this.beforePageChange();
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

  maximize() {
    let assetLineage = this.shadowRoot.querySelector('#asset-lineage');
    let fullscreenPopup = this.shadowRoot.querySelector('#fullscreen-popup');
    fullscreenPopup.appendChild(assetLineage);
    fullscreenPopup.open();
  }

  minimize () {
    let assetLineage = this.shadowRoot.querySelector('#asset-lineage');
    let content = this.shadowRoot.querySelector('#content');
    let fullscreenPopup = this.shadowRoot.querySelector('#fullscreen-popup');
    fullscreenPopup.removeChild(assetLineage);
    content.appendChild(assetLineage);
    fullscreenPopup.close();
  }

  beforeFullscreenPopupClose() {
    let isOpen = this.shadowRoot.querySelector('#fullscreen-popup').opened;
    if (!isOpen) {
      let assetLineage = this.shadowRoot.querySelector('#asset-lineage');
      let content = this.shadowRoot.querySelector('#content');
      content.appendChild(assetLineage);
    }
  }


  ready() {
    super.ready();

    window.addEventListener('egeria-open-spinner', e => {
      this.$.spinner.open();
    });

    window.addEventListener('egeria-close-spinner', e => {
      this.$.spinner.close();
    });

    window.addEventListener('egeria-open-modal', e => {
      this.modalMessage = e.detail.message;

      this.shadowRoot.querySelector("#modal").open();
    });

    window.addEventListener('egeria-update-breadcrumb', e => {
      this.crumbs = e.detail.breadcrumbs;
    });
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
          height:calc(100vh - 104px);
          margin:var(--egeria-view-margin);
        }
        
        .fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 0;
          margin: 0;
        }
        
        .minmax {
          position: relative;
          float: right;
          color: var(--egeria-primary-color);
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

            <template id="test" is="dom-if" if="[[ components ]]">
              <template is="dom-if" if="[[_hasComponent('asset-catalog')]]">
                <div name="asset-catalog" language="[[language]]"><a href="/asset-catalog/search">Asset Catalog</a></div>
              </template>
              <template is="dom-if" if="[[_hasComponent('glossary-view')]]">
                <div name="glossary" language="[[ language ]]"><a href="/glossary">Glossary View</a></div>
              </template>
              <template is="dom-if" if="[[_hasComponent('tex')]]">
                <div name="type-explorer"><a href="/type-explorer">Type Explorer</a></div>
              </template>
              <template is="dom-if" if="[[ _hasComponent('rex') ]]">
                <div name="repository-explorer"><a href="/repository-explorer">Repository Explorer</a></div>
              </template>
              <template is="dom-if" if="[[ _hasComponent('about') ]]">
                <div name="about"><a href="/about">About</a></div>
              </template>
            </template>
          </iron-selector>
        </app-drawer>

        <app-header-layout id = "header-layout">
          <app-header slot="header" condenses fixed effects="waterfall">
            <app-toolbar>
              <paper-icon-button on-tap="_toggleDrawer" id="toggle" icon="menu"></paper-icon-button>

              <template is="dom-if" if="[[narrow]]" >
                <div id="logo" class="white"></div>
              </template>

              <div>
                <template is="dom-if" if="[[!narrow]]" >
                  Open Metadata -
                </template>
                [[page]]
              </div>

              <div main-title="">

              </div>

              <div style="float: right">
                <egeria-user-options user="[[ currentUser ]]" roles="[[ roles ]]"></egeria-user-options>
              </div>
            </app-toolbar>

            <div class="breadcrumb">
              <egeria-breadcrumb id="breadcrumb" crumbs="[[ crumbs ]]"></egeria-breadcrumb>
            </div>
          </app-header>
          
          <template is="dom-if" if="[[ _isEqualTo(page, 'asset-lineage') ]]" restamp="true">
            <div>
              <paper-icon-button class="minmax" title="maximize" icon="icons:fullscreen" on-click="maximize"></paper-icon-button>
            </div>
          </template>
          
        <div class="content" id = "content">
          <template is="dom-if" if="[[ _isEqualTo(page, 'asset-catalog') ]]" restamp="true">
            <egeria-asset-catalog pages="[[ nextPages ]]"
                                  components="[[ components ]]"></egeria-asset-catalog>
          </template>

          <template is="dom-if" if="[[ _isEqualTo(page, 'asset-lineage') ]]" restamp="true">
            <egeria-asset-lineage id ="asset-lineage" 
                pages="[[ nextPages ]]"
                                  components="[[ components ]]"></egeria-asset-lineage>
          </template>

          <template is="dom-if" if="[[ _isEqualTo(page, 'glossary') ]]" restamp="true">
            <egeria-glossary></egeria-glossary>
          </template>

          <template is="dom-if" if="[[ _isEqualTo(page, 'type-explorer') ]]" restamp="true">
            <egeria-type-explorer></egeria-type-explorer>
          </template>

          <template is="dom-if" if="[[ _isEqualTo(page, 'repository-explorer') ]]" restamp="true">
            <egeria-repository-explorer pages="[[ nextPages ]]"></egeria-repository-explorer>
          </template>

          <template is="dom-if" if="[[ _isEqualTo(page, 'about') ]]" restamp="true">
            <egeria-about></egeria-about>
          </template>
        </div>
      </app-drawer-layout>

      <paper-dialog id="modal" modal>
        <p>[[ modalMessage ]]</p>

        <div class="buttons">
          <paper-button dialog-confirm autofocus>OK</paper-button>
        </div>
      </paper-dialog>

      <template is="dom-if" if="[[ _isEqualTo(page, 'asset-lineage') ]]" restamp="true">
        <paper-dialog id="fullscreen-popup" modal class="fullscreen" on-iron-overlay-closed="beforeFullscreenPopupClose" allow-click-through="[[ false ]]" >
        <div>
          <paper-icon-button class ="minmax" title="Minimize" icon="icons:fullscreen-exit" on-click="minimize"></paper-icon-button>
        </div>
        </paper-dialog>
      </template>


      <egeria-spinner id="spinner"
                      with-backdrop
                      scroll-action="lock"
                      always-on-top
                      no-cancel-on-outside-click
                      no-cancel-on-esc-key></egeria-spinner>
    `;
  }
}

window.customElements.define('egeria-single-page', EgeriaSinglePage);
