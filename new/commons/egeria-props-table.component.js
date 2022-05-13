/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */
import { PolymerElement, html } from '@polymer/polymer';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/app-layout/app-grid/app-grid-style.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '../../old/shared-styles.js';
import {ENV} from "../../env";

class EgeriaPropsTable extends PolymerElement {
  static get properties() {
    return {
      title: String,
      withHeader: { type: Boolean, value: false },
      withRowStripes: { type: Boolean, value: false },
      collapsable: {type: Boolean, value: false}
    }
  }

  ready() {
    super.ready();
    if( this.collapsable ){
      this.shadowRoot.querySelector('h3').style.cursor = 'pointer';
    }
  }

  _rowStripeClass(index) {
    if (this.withRowStripes && index % 2 == 1) {
      return 'rTableRowStripe';
    }
    return '';
  }

  _toggle(){
    if( this.collapsable ){
      this.shadowRoot.querySelector('#collapse').toggle();
      let el = this.shadowRoot.querySelector('#collapseIndicator');
      if(el.style.transform){
        el.style.removeProperty('transform');
      } else{
        el.style.transform = 'rotate(90deg)';
      }
      this.shadowRoot.querySelector('#end').scrollIntoView();
    }
  }

  _isGuid(item){
    return item.key.toLowerCase().includes('guid');
  }

  _buildItemDetailsUrl(item){
    return "/asset-catalog/" + this.btoa(item.value) + "/details";
  }

  btoa(string) {
    return ENV['PRODUCTION'] ? string : window.btoa(string);
  }

  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;
          padding: 10px 24px;
        }

        .rTable {
          display: table;
          width: 100%;
          border: solid 1px var( --egeria-primary-color );
          overflow: auto;
        }

        .rTableRow {
          display: table-row;
        }

        .rTableRowStripe{
          background-color:  var( --egeria-stripes-color );
        }

        .rTableHead {
          background-color:  var( --egeria-stripes-color );
        }

        .rTableCell, .rTableHead {
          display: table-cell;
          padding: 5px ;
        }

        .rTableHeading {
          display: table-header-group;
          font-weight: bold;
          padding: 5px ;
          color: var( --egeria-primary-color );
        }

        .rTableFoot {
          display: table-footer-group;
          font-weight: bold;
        }

        .rTableRowGroup {
          display: table-row-group;
        }

        .label {
          font-weight: bold;
          width: 250px;
          padding-left: 15px;
        }

        h3 {
          font-weight: normal;
        }
      </style>

      <div id="container" >
        <h3 on-click="_toggle">
          [[title]]
          <dom-if if="[[ collapsable ]]">
              <template>
                <iron-icon id="collapseIndicator" icon="icons:chevron-right"></iron-icon>
              </template>
          </dom-if>
        </h3>

        <iron-collapse id="collapse" opened="[[ !collapsable ]]"  no-animation>
          <div class="rTable">
            <dom-if if="[[ withHeader ]]">
              <template>
                <div class="rTableRow">
                  <div class="rTableHead">Property</div>
                  <div class="rTableHead">Value</div>
                </div>
              </template>
            </dom-if>
            <dom-repeat items="[[ items ]]">
              <template>
                <div class$="rTableRow [[ _rowStripeClass(index) ]]">
                  <div class="rTableCell label">[[item.key]]</div>
                  <div class="rTableCell">
                    <dom-if if="[[ _isGuid(item) ]]">
                      <template>
                        <a target="_blank" href="[[ _buildItemDetailsUrl(item) ]]">[[item.value]]</a>
                      </template>
                    </dom-if>
                    <dom-if if="[[ !_isGuid(item) ]]">
                      <template>
                        [[item.value]]
                      </template>
                    </dom-if>
                  </div>
                </div>
              </template>
            </dom-repeat>
          </div>
        </iron-collapse>
        <div id="end"></div>
      </div>
    `;
  }
}

window.customElements.define('egeria-props-table', EgeriaPropsTable);
