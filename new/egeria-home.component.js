/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icon/iron-icon';
import '@polymer/paper-button/paper-button';
import 'multiselect-combo-box/multiselect-combo-box.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';

import '../old/shared-styles.js';
import { egeriaFetch } from './commons/fetch';
import { setCookie } from './commons/local-storage';
import { RoleComponentsBehavior } from '../old/common/role-components';

class EgeriaHome extends mixinBehaviors(RoleComponentsBehavior, PolymerElement) {
  static get properties() {
    return {
      title: { type: String, value: '' },
      description: { type: Array, value: '' },

      q: { type: String, value: '' },
      selectedTypes: { type: Array, value: [] },
      types: { type: Array, value: [] },
    };
  }

  ready() {
    super.ready();

    this.titleChunks = !['', undefined].includes(this.title) ? this.title.split('|') : [];

    this.descriptionChunks = !['', undefined].includes(this.description) ? this.description.split('@@').map(d => {
      let [ title, description ] = d.split('||');

      return {
        title: title,
        description: description
      }
    }) : [];

    egeriaFetch(`/api/assets/types`)
      .then(data => {
        this.types = data;
      });
  }

  _logout() {
    egeriaFetch(`/api/logout`)
      .then(() => {
        setCookie('token', null);
      });
  }

  submit() {
    let self = this;

    this.$.combo.selectedItems.forEach(function (item) {
      self.selectedTypes.push(item.name);
    });

    window.location.href=`/asset-catalog/search?q=${ this.q }&types=${ this.selectedTypes.join(',')}`;
  }

  static get template() {
    return html`
    <style include="shared-styles">
      :host {
        display: block;
        height:100%;
        padding-top:50px;
        background-color: var(--egeria-background-color);
      }

      .row {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 15px;
      }

      .content {
        margin:0 auto;
        width:70%;
        text-align:center;
        margin-top:5px;
      }

      .content img {
        height:50px;
        margin-left: 25px;
      }

      .menu ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: var(--egeria-primary-color);
      }

      .menu li {
        float: left;
      }

      .menu li.pull-right {
        float:right;
      }

      .menu li a {
        display: block;
        color: #ffffff;
        text-align: center;
        padding: 16px;
        text-decoration: none;
      }

      .header {
        background: var(--egeria-home-header-background);
        height:400px;
      }

      .header h1 {
        margin-left:48px;
        padding-top:82px !important;
        line-height: 48px;
        font-weight: bold;
        white-space: nowrap;
      }

      .header h1 span {
        color:#ffffff;
        display: block;
        background-color: var(--egeria-primary-color);
        width: max-content;
        border-radius: 8px;
        padding: 3px 16px;
        margin: 8px 0px;
      }

      .header h1 span.title__part-1 {
        margin-left: 38px;
      }
      .header h1 span.title__part-2 {
        margin-left: 24px;
      }

      .search-form {
        width:60%;
        margin:0 auto;
        text-align:left;
      }

      .bg-color-gray {
        background-color: var(--egeria-stripes-color);
      }

      .br5 {
        border-radius:5px;
      }

      .mt20 {
        margin-top:20px;
      }

      .mt30 {
        margin-top:30px;
      }

      .p15 {
        padding:15px;
      }

      .search-input {
        display:inline-block;
        width:80%;
      }

      .description {
        background: var(--app-background-color);
      }

      .description-0 {
        margin-right:20px;
      }

      .description-2 {
        margin-left:20px;
      }

      .flexed {
        display: flex;
        justify-content: space-between;
      }
    </style>

    <div class="content">
      <div class="menu">
        <ul>
          <li><a href="/">Home</a></li>

          <template is="dom-if" if="[[ _hasComponent('asset-catalog') ]]">
            <li><a href="/asset-catalog/search">Search</a></li>
          </template>

          <template is="dom-if" if="[[ _hasComponent('glossary') ]]">
            <li><a href="/glossary">Glossary</a></li>
          </template>

          <li class="pull-right"><a href="/login" on-click="_logout">Logout</a></li>
          <li class="pull-right"><a href="/about">About</a></li>
        </ul>
      </div>
    </div>

    <div class="content header">
      <h1>
        <template is="dom-repeat" items="[[ titleChunks ]]">
          <span class$="title__part-[[ index ]]">{{ item }}</span>
        </template>
      </h1>
    </div>

    <div class="content bg-color-gray br5 mt30">
      <div class="search-form p15">
        <multiselect-combo-box class="multi-combo" id="combo" items="[[ types ]]"
                              item-label-path="name"
                              ordered="false"
                              placeholder="Open Metadata Type (required)"
                              required
                              error-message="Please select one">
        </multiselect-combo-box>

        <div>
          <paper-input class="search-input"
                      label="Search"
                      value="{{ q }}"
                      no-label-float
                      required
                      minlength="2"
                      autofocus>
              <iron-icon icon="search" slot="prefix" id="searchFieldIcon"></iron-icon>
          </paper-input>

          <paper-button on-tap="submit">Go</paper-button>
        </div>
      </div>
    </div>

    <div class="content mt30 flexed">
      <template is="dom-repeat" items="[[ descriptionChunks ]]">
        <div class$="description br5 p15 description-[[ index ]]">
          <strong>{{ item.title }}</strong>
          <p>{{ item.description }}</p>
        </div>
      </template>
    </div>

    <div class="content mt30">
      <div class="row">
        <p>Powered by</p>

        <img src="/images/Logo_transparent.png"/>
      </div>
    </div>
    `;
  }
}

window.customElements.define('egeria-home', EgeriaHome);
