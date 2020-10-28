import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

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
          selectedNodePosition: '',
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

  // bang method
  move(input, from, to) {
    let numberOfDeletedElm = 1;

    const elm = input.splice(from, numberOfDeletedElm)[0];

    numberOfDeletedElm = 0;

    input.splice(to, numberOfDeletedElm, elm);
  }

  _graphDataUpdate(newData, oldData) {
    if (newData.nodes.length > 0) {
      this.clearGraph();

      let xAxis = 100;
      let yAxis = 100;

      switch (newData.selectedNodePosition) {
        case 'FIRST':
          this.move(newData.nodes, (newData.nodes.length - 1), newData.nodes.length);

          break;
        case 'CENTER':
          this.move(newData.nodes, (newData.nodes.length - 1), parseInt(newData.nodes.length / 2));

          break;
        case 'LAST':
          this.move(newData.nodes, (newData.nodes.length - 1), 0);

          break;
        default:
          this.move(newData.nodes, (newData.nodes.length - 1), newData.nodes.length);

          break;
      }

      let myData = {
        selectedNodePosition: newData.selectedNodePosition,
        graphDirection: newData.graphDirection,

        nodes: newData.nodes.reverse().map(n => {
          let result = {
            ...n,
            fx: xAxis,
            fy: yAxis,
            width: this.getNodeWidth(n.properties.length),
            height: this.getNodeHeight(n.properties.length)
          };

          switch (newData.graphDirection) {
            case 'HORIZONTAL':
              xAxis = xAxis + this.getNodeWidth(n.properties.length) + 100;

              break;
            case 'VERTICAL':
              yAxis = yAxis + this.getNodeHeight(n.properties.length) + 100;

              break;
            default:
              xAxis = xAxis + this.getNodeWidth(n.properties.length) + 100;

              break;
          }

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
    this.graph = {
      nodes: [],
      links: []
    };

    this.nodes = [];
    this.links = [];

    this.updateForces();
    this.update();
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
    console.log('node = ', node);
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

<<<<<<< HEAD
=======
  getPropertySvg(type) {
    switch (type) {
      case 'TYPE1':
        return [
          'M27.71 9.29l-5-5A1 1 0 0 0 22 4H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V10a1 1 0 0 0-.29-.71zM12 6h8v4h-8zm8 20h-8v-8h8zm2 0v-8a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8H6V6h4v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6.41l4 4V26z'
        ];
      case 'TYPE2':
        return [
          'M27.71 9.29l-5-5A1 1 0 0 0 22 4H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V10a1 1 0 0 0-.29-.71zM12 6h8v4h-8zm8 20h-8v-8h8zm2 0v-8a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8H6V6h4v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6.41l4 4V26z'
        ];
      default:
        break;
    }
  }

  getSvgIcon(type) {
    switch (type) {
      case 'vaadin:cogs':
        return [
          'M15 8.75V6.25L13.5 5.75C13.375 5.375 13.25 4.875 13 4.5L13.75 3L11.875 1.375L10.5 2C10.125 1.75 9.75 1.625 9.25 1.5L8.75 0H6.25L5.75 1.5C5.375 1.625 4.875 1.75 4.5 2L3.125 1.375L1.375 3.125L2.125 4.625C1.875 5 1.75 5.375 1.625 5.875L0 6.25V8.75L1.5 9.25C1.625 9.625 1.75 10.125 2 10.5L1.375 11.875L3.125 13.625L4.625 12.875C5 13.125 5.375 13.25 5.875 13.375L6.25 15H8.75L9.25 13.5C9.625 13.375 10.125 13.25 10.5 13L12 13.75L13.75 12L13 10.5C13.25 10.125 13.375 9.75 13.5 9.25L15 8.75ZM3.75 7.5C3.75 5.375 5.375 3.75 7.5 3.75C9.625 3.75 11.25 5.375 11.25 7.5C11.25 9.625 9.625 11.25 7.5 11.25C5.375 11.25 3.75 9.625 3.75 7.5Z',
          'M9.37619 7.50003C9.37602 7.99747 9.17825 8.47448 8.82639 8.82611C8.47452 9.17774 7.99738 9.37519 7.49994 9.37503C7.00249 9.37486 6.52548 9.17709 6.17385 8.82523C5.82222 8.47336 5.62477 7.99622 5.62494 7.49878C5.6251 7.00133 5.82287 6.52432 6.17474 6.17269C6.34896 5.99858 6.55578 5.86049 6.78337 5.76631C7.01096 5.67213 7.25488 5.6237 7.50119 5.62378C7.7475 5.62386 7.99138 5.67246 8.21891 5.76679C8.44644 5.86112 8.65316 5.99935 8.82727 6.17358C9.00138 6.3478 9.13947 6.55462 9.23365 6.78221C9.32784 7.0098 9.37627 7.25372 9.37619 7.50003Z',
          'M20 3.75V2.5H19.25C19.25 2.25 19.125 2 19 1.875L19.5 1.375L18.625 0.5L18.125 1C17.875 0.875 17.75 0.75 17.5 0.75V0H16.25V0.75C16 0.75 15.75 0.875 15.625 1L15.125 0.5L14.25 1.375L14.75 1.875C14.625 2.125 14.5 2.25 14.5 2.5H13.75V3.75H14.5C14.5 4 14.625 4.25 14.75 4.375L14.25 4.875L15.125 5.75L15.625 5.25C15.875 5.375 16 5.5 16.25 5.5V6.25H17.5V5.5C17.75 5.5 18 5.375 18.125 5.25L18.625 5.75L19.5 4.875L19 4.375C19.125 4.125 19.25 4 19.25 3.75H20ZM16.875 4.375C16.125 4.375 15.625 3.875 15.625 3.125C15.625 2.375 16.125 1.875 16.875 1.875C17.625 1.875 18.125 2.375 18.125 3.125C18.125 3.875 17.625 4.375 16.875 4.375Z',
          'M19.25 14.75C19.125 14.375 19 14 18.75 13.625L19.125 12.875L18.25 12L17.625 12.5C17.25 12.25 16.875 12.125 16.5 12L16.25 11.25H15L14.75 12C14.375 12.125 14 12.25 13.625 12.5L12.875 12.125L12 13L12.375 13.75C12.125 14.125 12 14.5 11.875 14.875L11.25 15V16.25L12 16.5C12.125 16.875 12.25 17.25 12.5 17.625L12.125 18.375L13 19.25L13.75 18.875C14.125 19.125 14.5 19.25 14.875 19.375L15 20H16.25L16.5 19.25C16.875 19.125 17.25 19 17.625 18.75L18.375 19.125L19.25 18.25L18.75 17.625C19 17.25 19.125 16.875 19.25 16.5L20 16.25V15L19.25 14.75ZM15.625 17.5C14.625 17.5 13.75 16.625 13.75 15.625C13.75 14.625 14.625 13.75 15.625 13.75C16.625 13.75 17.5 14.625 17.5 15.625C17.5 16.625 16.625 17.5 15.625 17.5Z'
        ]
      case 'vaadin:road-branches':
        return [
          'M20 3.75V0H0V3.75H2.125L11.75 15.625C13.375 17.625 15.625 18.75 18 18.75H20V15H18.125C16.875 15 15.75 14.375 14.75 13.25L13.125 11.25H20V7.5H10L7 3.75H20Z'
        ];
      case 'vaadin:tab':
        return [
          'M0 0V15H20V0H0ZM16.25 11.25H15V7.5L11.25 11.25V8.75H3.75V6.25H11.25V3.75L15 7.5V3.75H16.25V11.25Z'
        ];
      case 'vaadin:file':
        return [
          'M9.625 6.25H16.5V20H0V0H9.625V6.25ZM11 5V0L16.5 5H11Z'
        ];
      case 'vaadin:ticket':
        return [
          'M17.5 0H2.5C2.5 1.375 1.375 2.5 0 2.5V10C1.375 10 2.5 11.125 2.5 12.5H17.5C17.5 11.125 18.625 10 20 10V2.5C18.625 2.5 17.5 1.375 17.5 0ZM16.25 11.25H3.75V1.25H16.25V11.25Z',
          'M5 2.5H15V10H5V2.5Z'
        ];
      case 'vaadin:file-process':
        return [
          'M15 0H6.25V7.5H7.125L7.375 8.375L7.5 8.5V1.25H13.75V6.25H18.75V17.5H11.25L11.625 18.125L11 18.75H20V5L15 0ZM15 5V1.25L18.75 5H15Z',
          'M6.875 14.375C6.875 14.7065 6.7433 15.0245 6.50888 15.2589C6.27446 15.4933 5.95652 15.625 5.625 15.625C5.29348 15.625 4.97554 15.4933 4.74112 15.2589C4.5067 15.0245 4.375 14.7065 4.375 14.375C4.375 14.0435 4.5067 13.7255 4.74112 13.4911C4.97554 13.2567 5.29348 13.125 5.625 13.125C5.95652 13.125 6.27446 13.2567 6.50888 13.4911C6.7433 13.7255 6.875 14.0435 6.875 14.375Z',
          'M9.875 15.5L11.25 15V13.75L9.875 13.25C9.75 12.875 9.625 12.5 9.375 12.125L10 10.875L9.125 10L7.875 10.625C7.5 10.375 7.125 10.25 6.75 10.125L6.25 8.75H5L4.5 10.125C4.125 10.25 3.75 10.375 3.375 10.625L2.125 10L1.25 10.875L1.875 12.25C1.625 12.625 1.5 13 1.375 13.375L0 13.75V15L1.375 15.5C1.5 15.875 1.625 16.25 1.875 16.625L1.25 17.875L2.125 18.75L3.5 18.125C3.875 18.375 4.25 18.5 4.625 18.625L5 20H6.25L6.75 18.625C7.125 18.5 7.5 18.375 7.875 18.125L9.125 18.75L10 17.875L9.375 16.5C9.625 16.25 9.75 15.875 9.875 15.5ZM5.625 16.875C4.25 16.875 3.125 15.75 3.125 14.375C3.125 13 4.25 11.875 5.625 11.875C7 11.875 8.125 13 8.125 14.375C8.125 15.75 7 16.875 5.625 16.875Z'
        ];
      case 'vaadin:table':
        return [
          'M0 0V20H20V0H0ZM6.25 18.6667H1.25V16H6.25V18.6667ZM6.25 14.6667H1.25V12H6.25V14.6667ZM6.25 10.6667H1.25V8H6.25V10.6667ZM6.25 6.66667H1.25V4H6.25V6.66667ZM12.5 18.6667H7.5V16H12.5V18.6667ZM12.5 14.6667H7.5V12H12.5V14.6667ZM12.5 10.6667H7.5V8H12.5V10.6667ZM12.5 6.66667H7.5V4H12.5V6.66667ZM18.75 18.6667H13.75V16H18.75V18.6667ZM18.75 14.6667H13.75V12H18.75V14.6667ZM18.75 10.6667H13.75V8H18.75V10.6667ZM18.75 6.66667H13.75V4H18.75V6.66667Z'
        ];
      case 'vaadin:grid-h':
        return [
          'M0 0V20H20V0H0ZM6.25 18.75H1.25V1.25H6.25V18.75ZM12.5 18.75H7.5V1.25H12.5V18.75ZM18.75 18.75H13.75V1.25H18.75V18.75Z'
        ];
      case 'vaadin:records':
        return [
          'M5 11.25H10V13.75H5V11.25Z',
          'M20 2.5H18.75V0H6.25V2.5H3.75V4.0625L3 5H1.25V7.1875L0 8.75V20H15L20 13.75V2.5ZM2.5 6.25H12.5V8.75H2.5V6.25ZM13.75 18.75H1.25V10H13.75V18.75ZM15 8.75H13.75V5H5V3.75H15V8.75ZM17.5 5.625L16.25 7.1875V2.5H7.5V1.25H17.5V5.625Z'
        ];
      default:
        break;
    }
  }

>>>>>>> c392729630... Refactor and update asset lineage component
  addIcon(node) {
    node
      .append('path')
      .attr('transform', `translate(20,20)`)
      .attr('d', 'M39.5566 15.2535C40.4498 16.8005 40.4498 18.7065 39.5566 20.2535L32.1934 33.007C31.3002 34.554 29.6496 35.507 27.8632 35.507H13.1368C11.3504 35.507 9.69979 34.554 8.80662 33.007L1.44338 20.2535C0.550211 18.7065 0.550212 16.8005 1.44338 15.2535L8.80662 2.5C9.69979 0.952994 11.3504 0 13.1368 0H27.8632C29.6496 0 31.3002 0.952994 32.1934 2.5L39.5566 15.2535Z')
      .attr('fill', '#5C82EB');

    node.each(function (d) {
      // TODO: extract as config property for
      //       happi-graph component
      //       (e.g. 'icons/bi-folder.svg')
      d3.xml(`icons/${d.type}.svg`)
        .then(data => {
          d3.select(this)
            .append('g')
            .attr('transform', `translate(31,28)`)
            .node()
            .append(data.documentElement);
        });
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
      .text((d) => d.value);

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

            d.properties.forEach(p => {
              selection
                .append('text')
                .attr('transform', `translate(95, ${labelHeight})`)
                .classed('property', true)
                .text((d) => p.value);

              // TODO: extract as config property for
              //       happi-graph component
              //       (e.g. 'icons/bi-folder.svg')
              d3.xml(`icons/${p.icon}.svg`)
                .then(data => {
                  selection
                    .append('g')
                    .attr('transform', `translate(65, ${iconHeight - 15})`)
                    .classed('property-icon', true)
                    .node()
                    .append(data.documentElement);

                  iconHeight = iconHeight + 30;
                });

              labelHeight = labelHeight + 30;
            });
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
          const positionToUseX = (d.fx >= 0) ? d.fx : d.x;
          const positionToUseY = (d.fy >= 0) ? d.fy : d.y;

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
        .link-container>.link {
          stroke: #000;
          stroke-width: 2px;
        }

        .node-container>.pin {
          /*fill: #eb4b0b;*/
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
          /*stroke: #eb4b0b;*/
          stroke: var(--egeria-primary-color);
        }

        .node-container>.header {
          fill: #000000;
          white-space: pre;
          font-size: 14px;
          letter-spacing: 0em;
          cursor: default;
          font-family: 'Roboto', sans-serif;
        }

        .node-container>.property {
          font-family: 'Roboto', sans-serif;
          font-size: 14px;
          cursor: default;
        }

        .node-container > .property-icon > svg > path {
          fill: var(--egeria-primary-color);
        }

        .node-container>.header>.value {}

        .node-container>.header>.label {
          /* font-weight: bold; */
          fill: #AFAFAF;
        }
      </style>

      <!-- <button on-click="customZoomOut">-</button> -->
      <!-- <button on-click="customZoomIn">+</button> -->
      <!-- <button on-click="fitContent">Fit</button> -->

<<<<<<< HEAD
      <!-- <button on-click="clearGraph">Clear</button> -->
=======
      <button on-click="clearGraph">Clear</button>

      <hr/>
>>>>>>> c392729630... Refactor and update asset lineage component

      <svg width="100%" height="600">
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