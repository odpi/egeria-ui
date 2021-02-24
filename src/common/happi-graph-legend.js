import {
  PolymerElement,
  html
} from '@polymer/polymer/polymer-element.js';

import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';

import {
  getIconByGroup
} from '../common/graph-group-icon-map';

class HappiGraphLegend extends PolymerElement {
  static get properties() {
    return {
      labels: {
        type: Object,
        value: []
      },
      graphData: {
        type: Object,
        value: {},
        observer: '_graphDataUpdate'
      },
      isMinimized: {
        type: Boolean,
        value: false
      }
    };
  }

  _graphDataUpdate(newGraphData) {
    let _nodes = newGraphData.nodes;
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
    return getIconByGroup(groupName);
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          font-size:12px;
        }

        img {
          height:20px;
          vertical-align:middle;
          margin-right:5px;
        }

        .svg-icons {
          color: var(--egeria-secondary-color);
          background:rgb(var(--egeria-primary-color-rgb), 0.9);
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
        }
      </style>

      <div class="dropdown">
        <paper-icon-button on-click="toggleMinimize" icon="icons:arrow-drop-down-circle"></paper-icon-button>
      </div>

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
