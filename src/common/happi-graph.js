import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { compute } from './graph-algorithms';

function Point(x, y) {
  if (!(this instanceof Point)) {
    return new Point(x, y);
  }
  this.x = x;
  this.y = y;
}

Point.add = function (a, b) {
  return Point(a.x + b.x, a.y + b.y);
}

Point.sub = function (a, b) {
  return Point(a.x - b.x, a.y - b.y);
}

Point.cross = function (a, b) {
  return a.x * b.y - a.y * b.x;
}

Point.scale = function (a, k) {
  return Point(a.x * k, a.y * k);
}

Point.unit = function (a) {
  return Point.scale(a, 1 / Point.magnitude(a));
}

Point.magnitude = function (a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
}

Point.eq = function (a, b) {
  return Math.abs(a.x - b.x) < 1e-6
    && Math.abs(a.y - b.y) < 1e-6;
}

class HappiGraph extends PolymerElement {
  constructor() {
    super();

    this.dragstart = this.dragstart.bind(this);
    this.dragging = this.dragging.bind(this);
    this.dragend = this.dragend.bind(this);
    this.ticked = this.ticked.bind(this);
    this.zooming = this.zooming.bind(this);
    this.onNodeClick = this.onNodeClick.bind(this);
  }

  static get properties() {
    return {
      graph: {
        type: Object,
        value: {
          nodes: [],
          links: []
        }
      },
      graphData: {
        type: Object,
        observer: '_graphDataUpdate',
        value: {
          nodes: [],
          links: [],
          graphDirection: ''
        }
      },
      nodes: {
        type: Array,
        value: []
      },
      links: {
        type: Array,
        value: []
      },
      currentTransformation: {
        type: Object,
        value: {
          translateX: 0,
          translateY: 0,
          scale: 1
        }
      },
      fitContentPadding: {
        type: Number,
        value: 350
      },
      forceProperties: {
        type: Object,
        value: {
          center: {
            x: 0.5,
            y: 0.5
          },
          collide: {
            enabled: true,
            strength: .7,
            iterations: 1,
            radius: 220
          },
          link: {
            enabled: true,
            distance: 150,
            iterations: 1
          }
        }
      },
      cachedIcons: {
        type: Object,
        value: {}
      }
    }
  }

  getNodeHeight(length) {
    let defaultHeight = 75;

    let computedHeight =
      (length >= 1 ? (length * 30) : 0);

    return defaultHeight + computedHeight;
  }

  getNodeWidth(length) {
    let defaultWidth = 200;

    return length >= 1 ? 250 : defaultWidth;
  }

  _graphDataUpdate(newData, oldData) {
    this.clearGraph();

    if (newData.nodes.length > 0) {
      let finalNodes = [];

      let selectedNode = newData.nodes.filter(n => n.selected === true).pop();

      let newNodes = compute(selectedNode.id, newData.nodes, newData.links);

      finalNodes = [
        ...newNodes
      ];

      let myData = {
        graphDirection: newData.graphDirection,

        nodes: finalNodes.map(n => {
          let result = {
            ...n,
            fx: n.w ? n.w * 350 : 0, // TODO: calculate these coordinates so that
            fy: n.h ? n.h * 350 : 0, //       all nodes are centered
            width: this.getNodeWidth(n.properties.length),
            height: this.getNodeHeight(n.properties.length)
          };

          return result;
        })
      };

      myData.links = [
        ...newData.links.map(e => {
          return {
            id: `${e.source}-${e.target}`,
            label: e.label,
            source: myData.nodes.find(n => n.id === e.source),
            target: myData.nodes.find(n => n.id === e.target),
            connectionToSource: e.connectionToSource,
            connectionToTarget: e.connectionToTarget
          };
        })
      ];

      this.graph = {
        ...myData
      };

      this.updateGraph();
    }
  }

  updateGraph() {
    this.fitContent();
    this.updateForces();
    this.update();
  }

  clearGraph() {
    if (this.svg) {
      this.graph = {
        nodes: [],
        links: [],
        graphDirection: ''
      };

      this.nodes = [];
      this.links = [];

      this.simulation = d3.forceSimulation();

      this.fitContent();
      this.initializeForces();
      this.updateForces();
      this.update();
    }
  }

  connectedCallback() {
    super.connectedCallback();

    this.svg = d3.select(this.shadowRoot.querySelector('svg'));

    this.width = +this.svg.node().getBoundingClientRect().width;
    this.height = +this.svg.node().getBoundingClientRect().height;

    this.allGroup =
      this.svg
        .append('g')
        .attr('class', 'everything');

    this.linksGroup =
      this.allGroup
        .append('g')
        .attr('class', 'links');

    this.nodesGroup =
      this.allGroup
        .append('g')
        .attr('class', 'nodes');

    this.zoom =
      d3
        .zoom()
        .on('zoom', this.zooming);

    this.svg.call(this.zoom);

    this.graph = {
      nodes: []
    };

    this.graph.links = [];

    this.simulation = d3.forceSimulation();

    this.fitContent();
    this.initializeForces();
    this.updateForces();
    this.update();
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

  zooming() {
    this.currentTransformation.scale = d3.event.transform.k;
    this.currentTransformation.translateX = d3.event.transform.x;
    this.currentTransformation.translateY = d3.event.transform.y;

    this.allGroup.attr('transform', d3.event.transform);
  }

  getGraphBox() {
    if (this.graph.nodes.length === 0) {
      return {
        minX: 0,
        minY: 0,
        maxX: 0,
        maxY: 0
      };
    }

    let minX = this.graph.nodes[0].fx;
    let minY = this.graph.nodes[0].fy;

    let maxX = minX + this.graph.nodes[0].width;
    let maxY = minY + this.graph.nodes[0].height;

    if (this.graph.nodes.length > 1) {

      for (let i = 1; i < this.graph.nodes.length; i++) {
        if (this.graph.nodes[i].fx < minX) {
          minX = this.graph.nodes[i].fx;
        }
        if (this.graph.nodes[i].fy < minY) {
          minY = this.graph.nodes[i].fy;
        }

        if ((this.graph.nodes[i].fx + this.graph.nodes[i].width) > maxX) {
          maxX = this.graph.nodes[i].fx + this.graph.nodes[i].width;
        }
        if ((this.graph.nodes[i].fy + this.graph.nodes[i].height) > maxY) {
          maxY = this.graph.nodes[i].fy + this.graph.nodes[i].height;
        }
      }
    }

    return {
      minX: minX,
      minY: minY,
      maxX: maxX,
      maxY: maxY
    };
  }

  fitContent() {
    let resultTransformation = this.getFitContentTransformation(this.currentTransformation);
    resultTransformation = this.getCenterContentTransformation(resultTransformation);

    let self = this;

    this.svg.transition()
      .call(
        self.zoom.transform,
        d3.zoomIdentity
          .translate(resultTransformation.translateX, resultTransformation.translateY)
          .scale(resultTransformation.scale)
      );
  }

  getCenterContentTransformation(currentTransformation) {
    let graphBox = this.getGraphBox();

    let graphCenterX = (graphBox.minX + graphBox.maxX) * 0.5 * currentTransformation.scale;
    let graphCenterY = (graphBox.minY + graphBox.maxY) * 0.5 * currentTransformation.scale;

    let svgMidX = this.width * 0.5;
    let svgMidY = this.height * 0.5;

    let diffX = svgMidX - graphCenterX;
    let diffY = svgMidY - graphCenterY;

    return {
      translateX: diffX,
      translateY: diffY,
      scale: currentTransformation.scale
    };
  }

  getFitContentTransformation(currentTransformation) {
    let graphBox = this.getGraphBox();

    let graphWidth = graphBox.maxX - graphBox.minX;
    graphWidth += this.fitContentPadding;

    let graphHeight = graphBox.maxY - graphBox.minY;
    graphHeight += this.fitContentPadding;

    let svgAspectRatio = this.width / this.height;
    let graphAspectRatio = graphWidth / graphHeight;

    let newScale = currentTransformation.scale;

    if (graphAspectRatio > svgAspectRatio) {
      newScale = this.width / graphWidth;
    } else if (graphAspectRatio < svgAspectRatio) {
      newScale = this.height / graphHeight;
    }

    return {
      translateX: currentTransformation.translateX,
      translateY: currentTransformation.translateY,
      scale: newScale
    };
  }

  initializeForces() {
    this.simulation
      .force('link', d3.forceLink().id(d => d.id))
      .force('collide', d3.forceCollide())
      .force('center', d3.forceCenter());
  }

  updateForces() {
    this.simulation
      .force('center')
      .x(this.width * this.forceProperties.center.x)
      .y(this.height * this.forceProperties.center.y);

    this.simulation
      .force('collide')
      .strength(this.forceProperties.collide.strength * this.forceProperties.collide.enabled)
      .radius(this.forceProperties.collide.radius)
      .iterations(this.forceProperties.collide.iterations);

    this.simulation
      .force('link')
      .distance(this.forceProperties.link.distance)
      .iterations(this.forceProperties.link.iterations)
      .links(this.forceProperties.link.enabled ? this.graph.links : []);
  }

  restartSimulation() {
    let self = this;

    this.simulation
      .nodes(self.graph.nodes)
      .on('tick', this.ticked);

    this.simulation
      .force('link')
      .links(self.graph.links);

    this.simulation
      .alpha(0.3)
      .restart();
  }

  update() {
    this.updateLinks();
    this.updateNodes();

    this.restartSimulation();
  }

  updateNodes() {
    this.nodes =
      this.nodesGroup
        .selectAll('.node-container')
        .data(this.graph.nodes, (d) => d.id);

    this.nodes
      .exit()
      .remove();

    let nodeEnter =
      this.nodes
        .enter();

    nodeEnter = this.addNodes(nodeEnter);

    this.nodes =
      nodeEnter
        .merge(this.nodes);
  }

  updateLinks() {
    this.links =
      this.linksGroup
        .selectAll('.link-container')
        .data(this.graph.links, (d) => d.id);

    this.links
      .exit()
      .remove();

    let linkEnter =
      this.links
        .enter();

    linkEnter = this.addLinks(linkEnter);

    this.links =
      linkEnter
        .merge(this.links);
  }

  addIcon(node) {
    let self = this;

    node
      .append('path')
      .attr('transform', `translate(20,20)`)
      .attr('d', 'M39.5566 15.2535C40.4498 16.8005 40.4498 18.7065 39.5566 20.2535L32.1934 33.007C31.3002 34.554 29.6496 35.507 27.8632 35.507H13.1368C11.3504 35.507 9.69979 34.554 8.80662 33.007L1.44338 20.2535C0.550211 18.7065 0.550212 16.8005 1.44338 15.2535L8.80662 2.5C9.69979 0.952994 11.3504 0 13.1368 0H27.8632C29.6496 0 31.3002 0.952994 32.1934 2.5L39.5566 15.2535Z')
      .attr('fill', '#5C82EB');

    node.each(function (d) {
      if (self.cachedIcons[d.type]) {
        let icon = new DOMParser()
          .parseFromString(self.cachedIcons[d.type], 'application/xml')
          .documentElement;

        d3.select(this)
          .append('g')
          .attr('transform', `translate(31,28)`)
          .node()
          .append(icon);
      } else {
        // TODO: extract as config property for
        //       happi-graph component
        //       (e.g. 'icons/bi-folder.svg')
        fetch(`icons/${d.type}.svg`)
          .then(response => response.text())
          .then(data => {
            let icon = new DOMParser()
              .parseFromString(data, 'application/xml')
              .documentElement;

            d3.select(this)
              .append('g')
              .attr('transform', `translate(31,28)`)
              .node()
              .append(icon);

            self.cachedIcons[d.type] = data;
          });
      }
    })
  }

  isSelected(node) {
    node
      .append('path')
      .classed('pin', true)
      .attr('d', (d) => {
        if (d.selected) {
          return 'M7 2h10v2l-2 1v5l3 3v3h-5v4l-1 3l-1-3v-4H6v-3l3-3V5L7 4z';
        }
      })
      .attr('transform', (d) => {
        let x = d.width - 30;
        let y = 10;

        return `translate(${x} ${y}) rotate(30 0 0)`;
      });
  }

  addLinks(enterSelection) {
    const linksContainerSelection =
      enterSelection
        .append('g')
        .classed('link-container', true);

    const linksSelection =
      linksContainerSelection
        .append('line')
        .classed('link', true)
        .attr('data-start', (d) => d.source.id)
        .attr('data-stop', (d) => d.target.id)
        .attr('marker-start', (d) => (d.connectionToSource) ? 'url(#arrow-start)' : '')
        .attr('marker-end', (d) => (d.connectionToTarget) ? 'url(#arrow-end)' : '');

    return linksContainerSelection;
  }

  addHeader(node) {
    let header =
      node
        .append('g')
        .classed('header', true);

    header.append('text')
      .attr('transform', `translate(70, 30)`)
      .classed('value', true)
      .text((d) => d.value.length > 18 ? `${d.value.substring(0, 18)}...` : d.value);

    header.append('text')
      .attr('transform', `translate(70, 50)`)
      .classed('label', true)
      .text((d) => d.label);

    this.addIcon(node);
  }

  addProperties(node) {
    let self = this;

    node.each(function (d) {
      d3.select(this)
        .call(function (selection) {
          if (d.properties) {
            let labelHeight = 80;
            let iconHeight = 80;

            for (const p of d.properties) {
              selection
                .append('text')
                .attr('transform', `translate(95, ${labelHeight})`)
                .classed('property', true)
                .text(() => p.value.length > 18 ? `${p.value.substring(0, 18)}...` : p.value)

              if (self.cachedIcons[p.icon]) {
                let icon = new DOMParser()
                  .parseFromString(self.cachedIcons[p.icon], 'application/xml')
                  .documentElement;

                selection
                  .append('g')
                  .attr('transform', `translate(65, ${iconHeight - 15})`)
                  .classed('property-icon', true)
                  .node()
                  .append(icon);

                iconHeight = iconHeight + 30;
              } else {
                // TODO: extract as config property for
                //       happi-graph component
                //       (e.g. 'icons/bi-folder.svg')
                fetch(`icons/${p.icon}.svg`)
                  .then(response => response.text())
                  .then(data => {
                    let icon = new DOMParser()
                      .parseFromString(data, 'application/xml')
                      .documentElement;

                    selection
                      .append('g')
                      .attr('transform', `translate(65, ${iconHeight - 15})`)
                      .classed('property-icon', true)
                      .node()
                      .append(icon);

                    iconHeight = iconHeight + 30;

                    self.cachedIcons[p.icon] = data;
                  });
              }

              labelHeight = labelHeight + 30;
            }
          }
        });
    })
  }

  addRectangle(node) {
    node.append('rect')
      .attr('id', (d) => d.id)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', d => d.width)
      .attr('height', d => d.height)
      .classed('node', true);
  }

  addNodes(enterSelection) {
    const nodesContainerSelection =
      enterSelection
        .append('g')
        .attr('transform', function (d) {
          const positionToUseX = (d.fx >= 0) ? d.fx : d.w;
          const positionToUseY = (d.fy >= 0) ? d.fy : d.h;

          return `translate(${positionToUseX},${positionToUseY})`;
        })
        .on('click', this.onNodeClick)
        .classed('node-container', true)
        .classed('selected', function (d) { return d.selected; })
        .call(
          d3.drag()
            .on('start', this.dragstart)
            .on('drag', this.dragging)
            .on('end', this.dragend)
        );

    this.addRectangle(nodesContainerSelection);

    this.addHeader(nodesContainerSelection);

    this.isSelected(nodesContainerSelection);

    this.addProperties(nodesContainerSelection);

    return nodesContainerSelection;
  }

  ticked() {
    let calculateNodeCenterX = (nodeX) => {
      return nodeX + (50 + 2 * 10) / 2;
    };

    let calculateNodeCenterY = (nodeY) => {
      return nodeY + (50 + 2 * 10) / 2;
    };

    let self = this;

    this.links
      .selectAll('.link')
      .each(function (data) {
        const intersection = self.getIntersection(data.source, data.target);

        d3.select(this)
          .attr('x1', () => {
            let calculatedEndX = calculateNodeCenterX(data.source.x);

            if (intersection) {
              calculatedEndX = intersection.x1;
            }

            return calculatedEndX;
          })
          .attr('y1', () => {
            let calculatedEndX = calculateNodeCenterY(data.source.y);

            if (intersection) {
              calculatedEndX = intersection.y1;
            }

            return calculatedEndX;
          })
          .attr('x2', () => {
            let calculatedEndX = calculateNodeCenterX(data.target.x);

            if (intersection) {
              calculatedEndX = intersection.x2;
            }

            return calculatedEndX;
          })
          .attr('y2', () => {
            let calculatedEndY = calculateNodeCenterY(data.target.y);

            if (intersection) {
              calculatedEndY = intersection.y2;
            }

            return calculatedEndY;
          });
      });

    this.nodes
      .attr('transform', (d) => {
        const positionToUseX = (d.fx >= 0) ? d.fx : d.x;
        const positionToUseY = (d.fy >= 0) ? d.fy : d.y;

        return `translate(${positionToUseX},${positionToUseY})`;
      });
  }

  dragstart(d) {
    if (!d3.event.active) {
      this.simulation.alphaTarget(0.3).restart();
    }

    d.fx = d.x;
    d.fy = d.y;
  }

  dragging(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  dragend(d) {
    if (!d3.event.active) {
      this.simulation.alphaTarget(1);
    }

    d.x = d.fx;
    d.y = d.fy;
  }

  pointInSegment(s, p) {
    let a = s[0];
    let b = s[1];

    return Math.abs(Point.cross(Point.sub(p, a), Point.sub(b, a))) < 1e-6
      && Math.min(a.x, b.x) <= p.x
      && p.x <= Math.max(a.x, b.x)
      && Math.min(a.y, b.y) <= p.y
      && p.y <= Math.max(a.y, b.y);
  }

  lineLineIntersection(s1, s2) {
    let a = s1[0];
    let b = s1[1];
    let c = s2[0];
    let d = s2[1];
    let v1 = Point.sub(b, a);
    let v2 = Point.sub(d, c);

    if (Math.abs(Point.cross(v1, v2)) < 1e-6) {
      // collinear
      return null;
    }

    let kNum = Point.cross(
      Point.sub(c, a),
      Point.sub(d, c)
    );

    let kDen = Point.cross(
      Point.sub(b, a),
      Point.sub(d, c)
    );

    let ip = Point.add(
      a,
      Point.scale(
        Point.sub(b, a),
        Math.abs(kNum / kDen)
      )
    );

    return ip;
  }

  segmentSegmentIntersection(s1, s2) {
    let ip = this.lineLineIntersection(s1, s2);

    if (ip && this.pointInSegment(s1, ip) && this.pointInSegment(s2, ip)) {
      return ip;
    }
  }

  boxSegmentIntersection(box, lineSegment) {
    let topLeft = Point(box.x, box.y);
    let topRight = Point(box.x + box.width, box.y);
    let botLeft = Point(box.x, box.y + box.height);
    let botRight = Point(box.x + box.width, box.y + box.height);
    let boxSegments = [
      // top
      [topLeft, topRight],
      // bot
      [botLeft, botRight],
      // left
      [topLeft, botLeft],
      // right
      [topRight, botRight]
    ];

    let ip;

    for (let i = 0; !ip && i < 4; i += 1) {
      ip = this.segmentSegmentIntersection(boxSegments[i], lineSegment);
    }

    return ip;
  }

  boxCenter(a) {
    return Point(
      a.x + a.width / 2,
      a.y + a.height / 2
    );
  }

  buildSegmentThroughCenters(a, b) {
    return [this.boxCenter(a), this.boxCenter(b)];
  }

  // should return {x1, y1, x2, y2}
  getIntersection(a, b) {
    let segment = this.buildSegmentThroughCenters(a, b);
    let ia = this.boxSegmentIntersection(a, segment);
    let ib = this.boxSegmentIntersection(b, segment);

    if (ia && ib && !Point.eq(ia, ib)) {

      // problem: the arrows are drawn after the intersection with the box
      // solution: move the arrow toward the other end

      let unitV = Point.unit(Point.sub(ib, ia));
      // k = the width of the marker
      let k = 18;
      ib = Point.sub(ib, Point.scale(unitV, k));

      return {
        x1: ia.x,
        y1: ia.y,
        x2: ib.x,
        y2: ib.y
      }
    }
  }

  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          flex-grow: 1;
        }

        .link-container>.link {
          stroke: #000;
          stroke-width: 2px;
        }

        .node-container>.pin {
          fill: var(--egeria-primary-color);
        }

        .node-container>.node {
          rx: 40;
          ry: 40;
          fill: #fff;
          stroke: #cccccc;
          stroke-width: 1px;
        }

        .node-container.selected>.node {
          stroke-width: 4px;
          stroke: var(--egeria-primary-color);
        }

        .node-container>.header {
          fill: #000000;
          white-space: pre;
          font-size: 14px;
          letter-spacing: 0em;
          cursor: default;
          font-family: --var(--custom-font-family);
        }

        .node-container>.property {
          font-family: --var(--custom-font-family);
          font-size: 14px;
          cursor: default;
        }

        .node-container > .property-icon > svg > path {
          fill: var(--egeria-primary-color);
        }

        .node-container>.header>.value {}

        .node-container>.header>.label {
          fill: #AFAFAF;
        }
      </style>

      <!-- <button on-click="customZoomOut">-</button> -->
      <!-- <button on-click="customZoomIn">+</button> -->
      <!-- <button on-click="fitContent">Fit</button> -->

      <!-- <button on-click="clearGraph">Clear</button> -->

      <svg width="100%" height="100%">
        <defs>
          <marker id="arrow-start" markerWidth="10" markerHeight="10" refx="0" refy="3" orient="auto"
            markerUnits="strokeWidth">
            <path d="M9,0 L9,6 L0,3 z" fill="#000" />
          </marker>

          <marker id="arrow-end" markerWidth="10" markerHeight="10" refx="0" refy="3" orient="auto"
            markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#000" />
          </marker>
        </defs>
      </svg>
    `;
  }
}

window.customElements.define('happi-graph', HappiGraph);
