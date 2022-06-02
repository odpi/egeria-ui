import React from "react";
import * as d3 from "d3";
import "./happi-graph.scss";
import { mapLinks, mapNodes } from "./happi-graph.helpers";
import { elkApproach, visApproach } from "./happi-graph.algorithms";
import { addLinks, addNodes, centerGraph, customZoomIn, customZoomOut } from "./happi-graph.render";
import HappiGraphLegend from "./happi-graph-legend.component";

import { ActionIcon } from '@mantine/core';

import {
  MdZoomIn,
  MdZoomOut,
  MdOutlineCenterFocusWeak
} from 'react-icons/md';

import {
  AiOutlineFullscreen,
  AiOutlineFullscreenExit
} from 'react-icons/ai';

interface Props {
  actions: any;
  algorithm?: string;
  selectedNodeId: string;
  rawData: any;
  debug?: boolean;
  graphDirection?: string;
  nodeCountLimit?: number;
  nodeDistanceX?: number;
  nodeDistanceY?: number;
}

interface State {
  algorithm: string;
  rawData: any;
  debug: boolean;
  graphDirection: string;
  happiGraph: any;
  isLoading: boolean;
  links: any;
  nodeCountLimit: number;
  nodeDistanceX: number;
  nodeDistanceY: number;
  nodes: any;
  selectedNodeId: string;
  svg: any;
  zoom: any;
  allGroup: any;
  isFullscreen: boolean;
}

class HappiGraph extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const mappedNodes = mapNodes(props.rawData.nodes, props.selectedNodeId);
    const mappedLinks = mapLinks(props.rawData.edges, mappedNodes);

    this.state = {
      algorithm: props.algorithm ? props.algorithm : 'ELK',
      rawData: { ...props.rawData },
      debug: props.debug === true ? true : false,
      graphDirection: props.graphDirection ? props.graphDirection : 'HORIZONTAL',
      happiGraph: React.createRef(),
      isLoading: true,
      links: [...mappedLinks],
      nodeCountLimit: props.nodeCountLimit ? props.nodeCountLimit : 0,
      nodeDistanceX: props.nodeDistanceX ? props.nodeDistanceX : 350,
      nodeDistanceY: props.nodeDistanceY ? props.nodeDistanceY : 350,
      nodes: [...mappedNodes],
      selectedNodeId: props.selectedNodeId,
      svg: null,
      zoom: null,
      allGroup: null,
      isFullscreen: false
    };
  }

  selectAlgorithm(callback: Function) {
    const {
      algorithm,
      graphDirection,
      nodes,
      links,
      nodeDistanceX,
      nodeDistanceY
    } = this.state;

    switch(algorithm) {
      case 'ELK':
        if(graphDirection === 'VERTICAL') {
          const {
            nodes: finalNodes,
            links: finalLinks
          } = visApproach(nodes, links, graphDirection, nodeDistanceX, nodeDistanceY);

          this.setState({
            isLoading: false,
            nodes: finalNodes,
            links: finalLinks
          }, () => {
            callback();
          });
        }

        if(graphDirection === 'HORIZONTAL') {
          elkApproach(nodes, links, graphDirection, nodeDistanceX, nodeDistanceY, (data: any) => {
            this.setState({
              isLoading: false,
              nodes: [...data.nodes],
              links: [...data.links]
            }, () => {
              callback();
            });
          });
        }

        break;
      case 'VISJS':
        const {
          nodes: finalNodes,
          links: finalLinks
        } = visApproach(nodes, links, graphDirection, nodeDistanceX, nodeDistanceY);

        this.setState({
          isLoading: false,
          nodes: finalNodes,
          links: finalLinks
        }, () => {
          callback();
        });

        break;
      default:
        console.log('NO_ALGORITHM_SELECTED');

        break;
    }
  }

  componentDidMount() {
    const { happiGraph } = this.state;

    console.log("componentDidMount()", this.state);

    this.setState({
      svg: d3.select(happiGraph.current)
    }, () => {
      this.selectAlgorithm(() => {
        console.log('Everything is ready.');
        this.init();
      });
    });
  }

  componentDidUpdate() {
    console.log("componentDidUpdate()", this.state);
  }

  init() {
    console.log('init()');
    const { svg, nodes, links, graphDirection } = this.state;

    const allGroup =
      svg.append('g')
         .attr('class', 'all-group');

    const linksGroup = allGroup.append('g').attr('class', 'links-group');
    const nodesGroup = allGroup.append('g').attr('class', 'nodes-group');

    let svgWidth = parseInt(svg.style('width'));
    let svgHeight = parseInt(svg.style('height'));

    console.log('svgWitdh = ', svgWidth);
    console.log('svgHeight = ', svgHeight);

    this.setState({
      allGroup: allGroup,
      zoom: d3.zoom()
              .extent([[0,0],[svgWidth, svgHeight]])
              .on('zoom', (e: any) => {
                allGroup.attr('transform', e.transform);
              })
    }, () => {
      const { zoom } = this.state;

      svg.call(zoom);

      addNodes(nodes, nodesGroup);
      addLinks(links, linksGroup, graphDirection, nodes);

      centerGraph(allGroup, svg, zoom);
    });
  }

  setFullscreen() {
    const {
      isFullscreen
    } = this.state;

    this.setState({isFullscreen: !isFullscreen}, () => {
      const {
        allGroup,
        svg,
        zoom
      } = this.state;

        centerGraph(allGroup, svg, zoom);
    });

  }

  render() {
    const { actions } = this.props;
    const {
      isLoading,
      happiGraph,
      zoom,
      svg,
      nodes,
      links,
      allGroup,
      isFullscreen
    } = this.state;

    return (<>
      <div className={`happi-graph-wrapper ${ isFullscreen ? 'happi-graph-fullscreen' : '' }`}>
        { isLoading && <h1>isLoading</h1>}

        <svg id="happi-graph" ref={ happiGraph }>
          <defs>
            <marker id="arrow-start"
                    markerWidth="10"
                    markerHeight="10"
                    refX="0"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth">
              <path d="M9,0 L9,6 L0,3 z" className="arrow" />
            </marker>

            <marker id="arrow-start-selected"
                    markerWidth="10"
                    markerHeight="10"
                    refX="0"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth">
              <path d="M9,0 L9,6 L0,3 z" className="arrow-selected" />
            </marker>

            <marker id="arrow-end"
                    markerWidth="10"
                    markerHeight="10"
                    refX="7"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" className="arrow" />
            </marker>

            <marker id="arrow-end-selected"
                    markerWidth="10"
                    markerHeight="10"
                    refX="7"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" className="arrow-selected" />
            </marker>
          </defs>
        </svg>

        <div className="happi-graph-actions">
          <ActionIcon title="Zoom In" variant="hover" size={35}>
            <MdZoomIn size={25} onClick={() => customZoomIn(zoom, svg) } />
          </ActionIcon>

          <ActionIcon title="Zoom Out" variant="hover" size={35}>
            <MdZoomOut size={25} onClick={() => customZoomOut(zoom, svg) } />
          </ActionIcon>

          <ActionIcon title="Fit to screen" variant="hover" size={35}>
            <MdOutlineCenterFocusWeak size={25} onClick={() => centerGraph(allGroup, svg, zoom) } />
          </ActionIcon>

          <ActionIcon title="Fullscreen" variant="hover" size={35}>
            { !isFullscreen && <AiOutlineFullscreen size={25} onClick={() => this.setFullscreen() } /> }
            { isFullscreen && <AiOutlineFullscreenExit size={25} onClick={() => this.setFullscreen() } /> }
          </ActionIcon>

          { actions }
        </div>

        <div className="happi-graph-legend">
          <HappiGraphLegend nodes={nodes} links={links}/>
        </div>
      </div>
    </>);
  }
}

export default HappiGraph;