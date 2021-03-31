import {
  PolymerElement,
  html
} from '@polymer/polymer/polymer-element.js';

import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-button/paper-button.js';

import { simpleSquareIcon } from './happi-graph-helpers';

class HappiGraphLegend extends PolymerElement {
  static get properties() {
    return {
      iconsMap: {
        type: Object,
        value: {}
      },
      propertiesMap: {
        type: Object,
        value: {}
      },
      labels: {
        type: Object,
        value: []
      },
      graphNodes: {
        type: Object,
        value: {},
        observer: '_graphNodesUpdate'
      },
      isMinimized: {
        type: Boolean,
        value: false
      }
    };
  }

  _graphNodesUpdate(newGraphNodes) {
    let _nodes = newGraphNodes;
    let propertiesMap = {};

    if(_nodes.length) {

      _nodes.map(n => {
        propertiesMap[n.label] = n.icon;

        n.properties.map(p => {
          propertiesMap[p.groupName] = p.icon;
        });
      });

      this.labels = [...Object.keys(propertiesMap)];
    } else {
      this.labels = [];
    }
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
  }

  getIcon(groupName) {
    if(this.propertiesMap[groupName] && this.iconsMap[this.propertiesMap[groupName].icon]) {
      return this.iconsMap[this.propertiesMap[groupName].icon];
    } else {
      return simpleSquareIcon;
    }
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          font-size:12px;
          font-family: var(--happi-graph-font-family);
        }

        img {
          height:20px;
          vertical-align:middle;
          margin-right:5px;
        }

        .svg-icons {
          color: var(--happi-graph-secondary-color);
          background: rgb(var(--happi-graph-primary-color-rgb), 0.9);
          padding:10px;
          max-width:400px;

          display: flex;
          flex-flow: row wrap;
          justify-content: space-around;
        }

        .svg-icon {
          display: flex;
          align-items: center;

          flex-grow: 4;
          margin:5px;
        }

        .svg-icon span {
          margin-top:1px;
          width:120px;
        }

        .dropdown {
          display:flex;
          justify-content:flex-end;
          cursor: pointer;
        }

        paper-button {
          margin: 0;
          padding: 0.2em 0.2em 0.4em 0.57em;
          font-size:15px;
          color: var(--happi-graph-primary-color);
          background-color: #f4f5f7;
          text-transform: none;
          --paper-button: {
            @apply(--layout-vertical);
            @apply(--layout-center-center);
          };
        }

        paper-button.keyboard-focus {
          font-weight: normal;
        }

        .label {
          margin-top:4px;
        }

        .label iron-icon {
          margin-top:-3px;
        }
      </style>

      <paper-button on-click="toggleMinimize" class="dropdown">
        <div class="label">
          Legend

          <template is="dom-if" if="[[ !isMinimized ]]">
            <iron-icon icon="icons:expand-more"></iron-icon>
          </template>

          <template is="dom-if" if="[[ isMinimized ]]">
            <iron-icon icon="icons:chevron-right"></iron-icon>
          </template>
        </div>
      </paper-button>

      <template is="dom-if" if="[[ isMinimized ]]" restamp="true">
        <div class="svg-icons">
          <template is="dom-repeat" items="{{ labels }}">
            <div class="svg-icon">
              <img src="data:image/svg+xml;utf8,[[ getIcon(item) ]]"/>

              <span>[[ item ]]</span>
            </div>
          </template>
        </div>
      </template>
    `;
  }
}

window.customElements.define('happi-graph-legend', HappiGraphLegend);
