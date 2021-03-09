import {
  PolymerElement,
  html
} from '@polymer/polymer/polymer-element.js';

import '@vaadin/vaadin-grid/vaadin-grid.js';

class HappiGraphStatistics extends PolymerElement {
  static get properties() {
    return {
      typeMapData: {
        type: Object,
        value: []
      },
      graphData: {
        type: Object,
        value: {},
        observer: '_graphDataUpdate'
      }
    };
  }

  _graphDataUpdate(newGraphData) {
    let _nodes = newGraphData.nodes;

    let typeMap = {};

    if(_nodes.length) {
      _nodes.map(n => {
        if(typeMap[n.label]) {
          typeMap[n.label]++;
        } else {
          typeMap[n.label] = 1;
        }
      });

      this.typeMapData = [
        ...Object.keys(typeMap).map(k => {
          return {
            key: k,
            apparitions: typeMap[k]
          };
        })
      ];
    } else {
      this.typeMapData = [];
    }
  }

  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          height: 100%;
          width: 100%;

          align-items: center;
          justify-content: center;
        }

        .container {
          width: 80%;
          max-width: 50%;
          margin: 0 auto;
          border: 4px solid var(--egeria-primary-color);
        }
      </style>

      <div class="container">
        <vaadin-grid id="statistics-grid" items="[[ typeMapData ]]" theme="row-stripes">
          <vaadin-grid-column width="70%">
              <template class="header">
                  <div>
                    <vaadin-grid-sorter path="key">Type</vaadin-grid-sorter>
                  </div>
              </template>
              <template>
                  [[ item.key ]]
              </template>
          </vaadin-grid-column>

          <vaadin-grid-column width="30%">
              <template class="header">
                  <div>
                    <vaadin-grid-sorter path="apparitions">Apparitions</vaadin-grid-sorter>
                  </div>
              </template>
              <template>[[ item.apparitions ]]</template>
          </vaadin-grid-column>
        </vaadin-grid>
      </div>
    `;
  }
}

window.customElements.define('happi-graph-statistics', HappiGraphStatistics);
