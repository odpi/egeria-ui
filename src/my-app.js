/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
import { AppLocalizeBehavior } from "@polymer/app-localize-behavior/app-localize-behavior.js";
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
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
import './my-icons.js';
import './token-ajax';
import './toast-feedback';
import './login-view.js';
import './user-options-menu';
import './shared-styles.js';
import './common/breadcrumb.js';
import { RoleComponentsBehavior } from "./common/role-components";

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);

class MyApp extends mixinBehaviors([AppLocalizeBehavior, RoleComponentsBehavior], PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;
          height:100vh;
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

          /* Reset some defaults */
          --paper-input-container: { padding: 0;};
          --paper-input-container-underline: { display: none; height: 0;};
          --paper-input-container-underline-focus: { display: none; };

          /* New custom styles */
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
      </style>

      <iron-localstorage name="my-app-storage" value="{{token}}"></iron-localstorage>
      <iron-localstorage name="user-components" value="{{components}}"></iron-localstorage>

      <app-location route="{{route}}" url-space-regex="^[[rootPath]]" use-hash-as-path query-params="{{queryParams}}"></app-location>

      <app-route route="{{route}}" pattern="/:page" data="{{routeData}}" tail="{{tail}}"></app-route>

      <toast-feedback></toast-feedback>

      <template is="dom-if" if="[[!token]]"  restamp="true">
        <login-view id="loginView" token="{{token}}"></login-view>
      </template>

      <template is="dom-if" if="[[token]]"  restamp="true">
      <token-ajax id=compAjax" last-response="{{components}}" url="/api/users/components" auto></token-ajax>

        <paper-dialog id="modal" modal>
          <p>[[modalMessage]]</p>
          <div class="buttons">
            <paper-button dialog-confirm autofocus>OK</paper-button>
          </div>
        </paper-dialog>

        <app-drawer-layout id="drawerLayout" flex forceNarrow  narrow="{{narrow}}" fullbleed="">
          <app-drawer id="drawer" slot="drawer"  swipe-open="[[narrow]]">
            <div id="logo"></div>
            <iron-selector selected="[[page]]"
                            attr-for-selected="name"
                            class="drawer-list"
                            swlectedClass="drawer-list-selected"
                            role="navigation">

              <template id="test" is="dom-if" if="[[components]]">
                <template is="dom-if" if="[[_hasComponent('asset-catalog')]]">
                  <div name="asset-catalog" language="[[language]]"><a href="[[rootPath]]#/asset-catalog/search">Asset Catalog</a></div>
                </template>
                <template is="dom-if" if="[[_hasComponent('glossary-view')]]">
                  <div name="glossary" language="[[language]]"><a href="[[rootPath]]#/glossary">Glossary View</a></div>
                </template>
                <template is="dom-if" if="[[_hasComponent('tex')]]">
                    <div name="type-explorer"><a href="[[rootPath]]#/type-explorer">Type Explorer</a></div>
                </template>
                <template is="dom-if" if="[[_hasComponent('rex')]]">
                    <div name="repository-explorer"><a href="[[rootPath]]#/repository-explorer">Repository Explorer</a></div>
                </template>
                <template is="dom-if" if="[[_hasComponent('about')]]">
                  <div name="about"><a href="[[rootPath]]#/about">About</a></div>
                </template>
              </template>
            </iron-selector>
          </app-drawer>

          <!-- Main content-->
          <app-header-layout>
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
                  <user-options></user-options>
                </div>
              </app-toolbar>

              <div class="breadcrumb">
                <bread-crumb id="breadcrumb" items="[[crumbs]]"></bread-crumb>
              </div>
            </app-header>

            <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
              <asset-view language="[[language]]" name="asset-catalog" route="[[tail]]"></asset-view>

              <glossary-view language="[[language]]" name="glossary" route="[[tail]]"></glossary-view>

              <about-view language="[[language]]" name="about"></about-view>

              <div name="asset-lineage">
                <template is="dom-if" if="[[ _isEqualTo(page, 'asset-lineage') ]]" >
                  <asset-lineage-view language="[[language]]" route="[[tail]]"></asset-lineage-view>
                </template>
              </div>

              <type-explorer-view language="[[language]]" name="type-explorer"></type-explorer-view>

              <repository-explorer-view language="[[language]]" name="repository-explorer"  route="[[tail]]"></repository-explorer-view>

              <my-view404 name="view404"></my-view404>

              <forbidden-403-page name="forbidden-403-page"></forbidden-403-page>

              <home-page name="home-page"></home-page>
            </iron-pages>

          </app-header-layout>
        </app-drawer-layout>
      </template>
    `;
  }

  _isEqualTo(value1, value2) {
    return value1 === value2;
  }

  static get properties() {
    return {
      language: { value: 'en' },
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged',
      },
      token: {
        type: Object,
        notify: true
      },
      routeData: Object,
      pages: {
        type: Array,
        value: [
          'asset-catalog',
          'asset-lineage',
          'type-explorer',
          'repository-explorer',
          'about',
          'glossary'
        ]
      },
      feedback: {
        type: Object,
        notify: true
      },
      crumbs: {
        type: Array
      },
      allCrumbs: {
        type: Object,
        value: {
          'home': { label: 'Home', href: '/#/' },
          'asset-catalog': { label: 'Asset Catalog', href: "asset-catalog/search" },
          'glossary': { label: 'Glossary', href: "glossary" },
          'asset-lineage': { label: 'Asset Catalog', href: "asset-catalog/search" },
          'type-explorer': { label: 'Type Explorer', href: "type-explorer" },
          'repository-explorer': { label: 'Repository Explorer', href: "repository-explorer" },
          'ultimateSource': { label: 'Ultimate Source', href: "ultimateSource" },
          'ultimateDestination': { label: 'Ultimate Destination', href: "ultimateDestination" },
          'endToEnd': { label: 'End To End Lineage', href: "endToEnd" },
          'sourceAndDestination': { label: 'Source and Destination', href: "sourceAndDestination" },
          'verticalLineage': { label: 'Vertical Lineage', href: "verticalLineage" },
          'about': { label: 'About', href: "about" }
        }
      }
    };
  }

  static get observers() {
    return [
      '_routePageChanged(routeData.page, components)',
      '_updateBreadcrumb(routeData.page)',
    ];
  }

  ready() {
    super.ready();
    this.addEventListener('logout', this._onLogout);
    this.addEventListener('open-page', this._onPageChanged);
    this.addEventListener('show-modal', this._onShowModal);
    this.addEventListener('set-title', this._onSetTitle);
    this.addEventListener('push-crumb', this._onPushCrumb);
  }

  _getDrawer() {
    var dL = this.shadowRoot.querySelector('#drawerLayout');
    if (dL) {
      return dL.drawer;
    }
    return;
  }

  _toggleDrawer() {
    var dL = this.shadowRoot.querySelector('#drawerLayout');
    if (dL.forceNarrow || !dL.narrow) {
      dL.forceNarrow = !dL.forceNarrow;
    } else {
      dL.drawer.toggle();
    }
  }

  _onPushCrumb(event) {
    var crumbs = [].concat(this.crumbs);

    crumbs.push(event.detail);

    this.crumbs = crumbs;
  }

  _onShowModal(event) {
    this.modalMessage = event.detail.message;

    this.shadowRoot.querySelector("#modal").open();
  }

  _updateBreadcrumb(page) {
    if (!page) return;
    var crumbs = [];
    var allCrumbs = new Map(Object.entries(this.allCrumbs));

    crumbs.push(allCrumbs.get('home'));
    var crumb = allCrumbs.get(page);
    if (crumb) {
      crumbs.push(crumb);
    }
    this.crumbs = crumbs;

  }

  _routePageChanged(page, components) {
    // Show the corresponding page according to the route.
    //
    // If no page was found in the route data, page will be an empty string.
    // Show 'asset-search' in that case. And if the page doesn't exist, show 'view404'.

    if (!page) {
      if ((!!components && components.includes('asset-catalog')) || (!!components && components.length === 0)) {
        this.page = 'asset-catalog';
      } else {
        this.page = 'home-page';
      }
    } else if (this.pages.indexOf(page) !== -1) {
      if ((!!components && components.includes(page)) || (!!components && components.length === 0)) {
        this.page = page;
      } else {
        this.page = 'forbidden-403-page';
      }
    } else {
      this.page = 'view404';
    }

    // Close a non-persistent drawer when the page & route are changed.
    var drawer = this._getDrawer();
    if (this.page != 'login' && drawer && !drawer.persistent) {
      this._getDrawer().close();
    }
  }

  _onPageChanged(event) {
    this.page = event.detail.page;
    this.subview = event.detail.subview;
    this.guid = event.detail.guid;
  }

  _onLogout(event) {
    //TODO invalidate token from server
    console.log('LOGOUT: removing token...');
    this.token = null;
    this.components = null;
  }

  _hasToken() {
    return typeof this.token !== "undefined" && this.token != null;
  }

  _pageChanged(page) {
    // Import the page component on demand.
    //
    // Note: `polymer build` doesn't like string concatenation in the import
    // statement, so break it up.

    switch (page) {
      case 'asset-lineage':
        import('./asset-lineage/asset-lineage-view.js');
        break;
      case 'type-explorer':
        import('./type-explorer/type-explorer-view.js');
        break;
      case 'repository-explorer':
        import('./repository-explorer/repository-explorer-view.js');
        break;
      case 'asset-catalog':
        import('./asset-catalog/asset-catalog-view.js');
        break;
      case 'glossary':
        import('./glossary/glossary-view.js');
        break;
      case 'about':
        import('./about-view.js');
        break;
      case 'view404':
        import('./error404.js');
        break;
      case 'forbidden-403-page':
        import('./forbidden403Page.js');
        break;
      case 'home-page':
        import('./home-page.js');
        break;
      default:
        console.warn('NOT_FOUND');
    }

    this._updateBreadcrumb(this.page);
  }

  attached() {
    this.loadResources(
      // The specified file only contains the flattened translations for that language:
      'locales/en.json',  //e.g. for es {"hi": "hola"}
      'en',               // unflatten -> {"es": {"hi": "hola"}}
      true                // merge so existing resources won't be clobbered
    );
  }
}

window.customElements.define('my-app', MyApp);
