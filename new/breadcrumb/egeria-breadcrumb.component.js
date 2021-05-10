/* SPDX-License-Identifier: Apache-2.0 */

/* Copyright Contributors to the ODPi Egeria project. */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import {} from '@polymer/polymer/lib/elements/dom-repeat.js';

class EgeriaBreadCrumb extends PolymerElement{
  static get properties() {
    return {
      crumbs: {
        type: Array,
      }
    };
  }

  computeSpanHidden(crumbs, index) {
    return (crumbs.length) === index;
  }

  static get template() {
    return html`
      <style>
        :host {
          display:block;
          height:30px;
          margin:5px 5px 5px 20px;
        }

        a {
          text-decoration: none;
          color: var(--egeria-secondary-color);
        }

        a:hover {
          text-decoration:underline;
        }

        .crumb {
          font-size:14px;
          max-width:600px;
          display: inline-block;
          white-space: nowrap;
          overflow: hidden !important;
          text-overflow: ellipsis;
        }
      </style>

      <div>
        <dom-repeat items="{{ crumbs }}">
          <template>
            <div class="crumb">
              <span hidden$="[[ computeSpanHidden(crumbs, index) ]]">/</span>

              <template is="dom-if" if="[[ item.href ]]">
                <a href="[[ item.href ]]">[[ item.name ]]</a>
              </template>

              <template is="dom-if" if="[[ !item.href ]]">
                [[ item.name ]]
              </template>
            </div>
          </template>
        </dom-repeat>
      </div>
    `;
  }
}

window.customElements.define('egeria-breadcrumb', EgeriaBreadCrumb);