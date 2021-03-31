import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import * as d3 from 'd3';
import '@polymer/paper-icon-button/paper-icon-button.js';

import './happi-graph-legend';
import { compute } from './happi-graph-algorithms';
import {
  addHeader,
  addIcon,
  addProperties,
  getNodeHeight,
  isSelected
} from './happi-graph-helpers';

class HappiGraph extends PolymerElement {
  constructor() {
    super();

    this.zooming = this.zooming.bind(this);
    this.onNodeClick = this.onNodeClick.bind(this);
  }

  static get properties() {
    return {
      iconsMap: {
        type: Object,
        value: null
      },
      propertiesMap: {
        type: Object,
        value: null
      },
      svg: {
        type: Object,
        value: null
      },
      zoom: {
        type: Object,
        value: null
      },
      allGroup: {
        type: Object,
        value: null
      },
      nodesGroup: {
        type: Object,
        value: null
      },
      linksGroup: {
        type: Object,
        value: null
      },
      graphDirection: {
        type: String,
        value: ''
      },
      nodes: {
        type: Array,
        value: []
      },
      links: {
        type: Array,
        value: []
      },
      graphData: {
        type: Object,
        value: null,
        observer: '_graphDataUpdate'
      }
    };
  }

  _graphDataUpdate(newGraphData) {
    console.log('_graphDataUpdate(', newGraphData, ')');

    if(newGraphData && newGraphData.nodes.length >= 0 && newGraphData.links.length >= 0) {
      this.removeData();

      this.graphDirection = newGraphData.graphDirection;

      this.nodes = newGraphData.nodes.map(n => {
        let keys = Object.keys(n.properties ? n.properties : {});

        let props = keys.map(k => {
          let camelCased = k.charAt(0).toUpperCase() + k.slice(1);

          return {
            value: n.properties[k],
            label: k,
            icon: this.propertiesMap[camelCased] ? this.propertiesMap[camelCased].icon : 'simple-square',
            groupName: camelCased
          }
        });

        let result = {
          id: n.id,
          type: this.propertiesMap[n.group] ? this.propertiesMap[n.group].icon : 'simple-square',
          value: n.label ? n.label : 'N/A',
          label: n.group ? n.group : 'N/A',
          selected: n.id === newGraphData.selectedNodeId,
          width: 250,
          height: getNodeHeight(props.length),
          properties: [
            ...props
          ]
        };

        this.links = newGraphData.links.map(e => {
          return {
            id: `${e.from}-${e.to}`,
            label: e.label,
            from: e.from,
            to: e.to,
            connectionFrom: e.connectionFrom ? e.connectionFrom : false,
            connectionTo: e.connectionTo ? e.connectionTo : true
          };
        });

        return result;
      });

      let selectedNode = this.nodes.filter(n => n.selected === true).pop();

      this.nodes = selectedNode ?
                   [...compute(selectedNode.id, this.nodes, this.links, newGraphData.graphDirection) ] :
                   [];

      this.links = [
        ...this.links.map(e => {
          return {
            id: `${e.from}-${e.to}`,
            label: e.label,
            from: this.nodes.find(n => n.id === e.from),
            to: this.nodes.find(n => n.id === e.to),
            connectionFrom: e.connectionFrom,
            connectionTo: e.connectionTo
          };
        })
      ];

      this.initGraph();
      this.addNodes();
      this.addLinks();
      this.centerGraph();
    } else {
      console.log('NEW_DATA_EMPTY');
    }
  }

  removeData() {
    this.nodes = [];
    this.links = [];
    this.graphData = null;

    this.allGroup ? this.allGroup.remove() : console.log('ALL_GROUP_EMPTY');
  }

  initGraph() {
    this.svg = d3.select(this.$.svg);

    this.allGroup =
      this.svg
        .append('g')
        .attr('class', 'all-group');

    this.linksGroup = this.allGroup.append('g').attr('class', 'links-group');
    this.nodesGroup = this.allGroup.append('g').attr('class', 'nodes-group');

    this.zoom =
      d3.zoom()
        .on('zoom', this.zooming);

    this.svg.call(this.zoom);
  }

  addNodes() {
    let self = this;

    let nodesGroup = this.nodesGroup.selectAll()
      .data(this.nodes)
      .enter();

    let nodeGroup =
      nodesGroup
        .append('g')
        .classed('node-group', true)
        .attr('id', (d) => d.id)
        .on('click', this.onNodeClick)
        .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
        .call(
          d3.drag()
            .on('start', (d) => {
              // console.log('DRAG_START', d);
            })
            .on('drag', function(d) {
              d.x = d3.event.x;
              d.y = d3.event.y;

              d3.select(this)
                .attr('transform', `translate(${d3.event.x}, ${d3.event.y})`);

                let _links =
                  d3.select(
                    d3.select(this)
                      .node()
                      .parentNode
                      .parentNode
                  )
                  .selectAll('.links-group')
                  .selectAll('line');

                _links
                  .filter(function(_d) {
                    return _d.from.id === d.id;
                  })
                  .attr('x1', () => self.graphDirection === 'HORIZONTAL' ? d3.event.x + d.width + 3 : d3.event.x + (d.width/2))
                  .attr('y1', () => self.graphDirection === 'HORIZONTAL' ? d3.event.y + (d.height/2) : d3.event.y - 3);

                _links
                  .filter(function(_d) {
                    return _d.to.id === d.id;
                  })
                  .attr('x2', () => self.graphDirection === 'HORIZONTAL' ? d3.event.x - 5 : d3.event.x + (d.width/2))
                  .attr('y2', () => self.graphDirection === 'HORIZONTAL' ? d3.event.y + (d.height/2) : d3.event.y + (d.height) + 5);
            })
            .on('end', (d) => {
              // console.log('DRAG_END', d);
            })
        );

    nodeGroup
      .append('rect')
      .attr('width', (d) => d.width)
      .attr('height', (d) => d.height)
      .classed('node', true)
      .classed('is-selected', (d) => d.selected)
      .attr('rx', 20)
      .attr('ry', 20);

    isSelected(nodeGroup);
    addHeader(nodeGroup);
    addIcon(nodeGroup, this.iconsMap);
    addProperties(nodeGroup, this.iconsMap);
  }

  addLinks() {
    let self = this;

    let linksGroup = this.linksGroup.selectAll()
      .data(this.links)
      .enter();

    linksGroup
      .append('line')
      .style('stroke', 'black')
      .style('stroke-width', 2)
      .attr('marker-start', (d) => (d.connectionFrom) ? 'url(#arrow-start)' : '')
      .attr('marker-end', (d) => (d.connectionTo) ? 'url(#arrow-end)' : '')
      .attr('from', function(d) { return d.from.id; })
      .attr('to', function(d) { return d.to.id; })
      .attr('x1', (d) => self.graphDirection === 'HORIZONTAL' ? d.from.x + d.from.width + 3 : d.from.x + (d.from.width/2))
      .attr('y1', (d) => self.graphDirection === 'HORIZONTAL' ? d.from.y + (d.from.height/2) : d.from.y - 3)

      .attr('x2', (d) => self.graphDirection === 'HORIZONTAL' ? d.to.x - 5 : d.to.x + (d.to.width/2))
      .attr('y2', (d) => self.graphDirection === 'HORIZONTAL' ? d.to.y + (d.to.height/2): d.to.y + (d.to.height) + 5);
  }

  zooming() {
    this.allGroup.attr('transform', d3.event.transform);
  }

  customZoom(value) {
    if (value > 0) {
      this.zoom.scaleBy(this.svg.transition(), 1.3);
    } else {
      this.zoom.scaleBy(this.svg.transition(), 0.7);
    }
  }

  customZoomIn() {
    this.customZoom(1);
  }

  customZoomOut() {
    this.customZoom(-1);
  }

  centerGraph() {
    let self = this;

    let svgWidth = parseInt(this.svg.style('width'));
    let svgHeight = parseInt(this.svg.style('height'));

    let graphBBox = this.allGroup.node().getBBox();

    let scaledBy = Math.min(
      (svgWidth - 50) / graphBBox.width,
      (svgHeight - 50) / graphBBox.height,
      1
    );

    let svgCenter = {
      x: svgWidth / 2,
      y: svgHeight / 2
    };

    this.svg.transition()
      .call(
        self.zoom.transform,
        d3.zoomIdentity
          .translate(
            svgCenter.x - ((graphBBox.x * scaledBy) + (graphBBox.width * scaledBy) / 2),
            svgCenter.y - ((graphBBox.y * scaledBy) + (graphBBox.height * scaledBy) / 2)
          )
          .scale(scaledBy)
      )
  }

  cachedGraph() {
    this.removeData();

    this.dispatchEvent(
      new CustomEvent('happi-graph-on-cached-graph', {
        bubbles: true,
        detail: {
          id: this.id
        }
      })
    );
  }

  onNodeClick(node) {
    this.dispatchEvent(
      new CustomEvent('happi-graph-on-node-click', {
        bubbles: true,
        detail: {
          nodeId: node.id
        }
      })
    );
  }

  hasSize(a) {
    if(a) {
      return a.length > 0;
    } else {
      return false;
    }
  }

  static get template() {
    return html`
      <style>
        :root {
          --lumo-font-family: var(--happi-graph-font-family);
          --iron-icon-fill-color: var(--happi-graph-primary-color);
        }

        :host {
          display: flex;
          flex-grow: 1;
          /* width: 100%;
          height: 100%; */
          font: var(--happi-graph-font-family);
        }

        .node {
          fill: #ffffff;
          stroke: #cccccc;
        }

        .node.is-selected {
          stroke-width: 4px;
          stroke: var(--happi-graph-primary-color);
        }

        .header {
          fill: #000000;
          white-space: pre;
          font-size: 14px;
          letter-spacing: 0em;
          cursor: default;
          font-family: var(--happi-graph-font-family);
        }

        .header > .value {
          font-size: 17px;
        }

        .header > .full-header {
          font-size: 17px;
        }

        .header > .label {
          fill: var(--happi-graph-gray-color);
        }

        .pin {
          fill: var(--happi-graph-primary-color);
        }

        .header > .full-header-background {
          fill: #ffffff;
          stroke: #cccccc;
          stroke-width: 1px;
        }

        .property-group > .property {
          font-family: var(--happi-graph-font-family);
          font-size: 14px;
          cursor: default;
        }

        .property-group > .full-property-background {
          fill: #ffffff;
          stroke: #cccccc;
          stroke-width: 1px;
        }

        .property-group > .property-icon > svg > path {
          fill: var(--happi-graph-primary-color);
        }

        .happi-graph-container {
          height:100%;
          width:100%;

          position:relative;
        }

        .happi-graph-svg {
          position:absolute;
          top:0;
          left:0;
          width: 100%;
          height: 100%;
        }

        .happi-graph-legend {
          position: absolute;
          top:0;
          right:0;
          margin-right: 5px;
          margin-top: 5px;
        }

        .happi-graph-actions {
          display:flex;
          flex-direction: column;
          position:absolute;
          top:0;
          left:0;
        }
      </style>

      <div class="happi-graph-container">
        <div class="happi-graph-svg">
          <svg id="svg" width="100%" height="100%">
            <defs>
              <marker id="arrow-start"
                      markerWidth="10"
                      markerHeight="10"
                      refx="0"
                      refy="3"
                      orient="auto"
                      markerUnits="strokeWidth">
                <path d="M9,0 L9,6 L0,3 z" fill="#000" />
              </marker>

              <marker id="arrow-end"
                      markerWidth="10"
                      markerHeight="10"
                      refx="7"
                      refy="3"
                      orient="auto"
                      markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#000" />
              </marker>
            </defs>
          </svg>
        </div>

        <template is="dom-if" if="[[ hasSize(nodes, graphData) ]]">
          <div class="happi-graph-legend">
            <happi-graph-legend graph-nodes="{{ nodes }}"
                                icons-map="{{ iconsMap }}"
                                properties-map="{{ propertiesMap }}"></happi-graph-legend>
          </div>
        </template>

        <template is="dom-if" if="[[ hasSize(nodes, graphData) ]]">
          <div class="happi-graph-actions">
            <slot name="pre-actions"></slot>

            <paper-icon-button icon="icons:zoom-in" on-click="customZoomIn"></paper-icon-button>
            <paper-icon-button icon="icons:zoom-out" on-click="customZoomOut"></paper-icon-button>
            <paper-icon-button icon="icons:settings-overscan" on-click="centerGraph"></paper-icon-button>
            <paper-icon-button icon="icons:cached" on-click="cachedGraph"></paper-icon-button>

            <slot name="post-actions"></slot>
          </div>
        </template>
      </div>
    `;
  }
}

window.customElements.define('happi-graph', HappiGraph);
