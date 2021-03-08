/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */
import {PolymerElement, html} from '@polymer/polymer';

import '../shared-styles.js';
import '@polymer/paper-styles/paper-styles.js';
import '@vaadin/vaadin-icons/vaadin-icons.js';
import {
    getIconByGroup
} from '../common/item-group-icon-map';

class AssetQualifiedNamView extends PolymerElement {

    static get properties() {
        return {
            qualified: {
                type: Array,
                notify: true,
            }
        };
    }

    getIcon(groupName) {
        return getIconByGroup(this._capitalizeFirstLetter(groupName));
    }

    _parseQualifiedName(str) {
        let regexpNames = /\((?<key>\w+)\)=(?<value>[a-zA-Z0-9_ ]+)/mg;
        let response = []
        let match = regexpNames.exec(str);
        do {
            response.push(match.groups);
        } while ((match = regexpNames.exec(str)) !== null);
        return response;
    }

    _capitalizeFirstLetter(str){
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    static get template() {
        return html`
            <custom-style>
                <style is="custom-style">

                </style>
            </custom-style>


            <style include="shared-styles">
                :host {
                    display: flex;
                    flex-flow: column;
                }
                img {
                    height:20px;
                    vertical-align:middle;
                    margin-right:5px;
                }
                ul{ 
                    margin: 0;
                    padding: 0;
                }
                li {
                    display: inline;
                    padding-right: 10px;
                    font-size: smaller ;
                }
                
                .masked { 
                    display: inline-flex;
                    width: 20px;
                    height: 20px;
                    background-color: var(--egeria-primary-color);
                }
                
            </style>
            <ul>
                <dom-repeat items="[[ _parseQualifiedName(qualified) ]]">
                  <template>
                      <li title="[[ _capitalizeFirstLetter(item.key) ]]">
                          <div class="masked" 
                               style$= "mask: url('data:image/svg+xml;utf8,[[ getIcon(item.key) ]]');
                                        -webkit-mask-image: url('data:image/svg+xml;utf8,[[ getIcon(item.key) ]]');"
                          ></div>
                          <span>[[ item.value ]]</span>
                      </li>
                  </template>
                </dom-repeat>
            </ul>`;
    }
}

window.customElements.define('asset-qualified-name-view', AssetQualifiedNamView);
