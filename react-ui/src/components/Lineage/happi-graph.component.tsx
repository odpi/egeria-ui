import React from "react";
import * as d3 from "d3";
import "./happi-graph.scss";
import { mapLinks, mapNodes } from "./happi-graph.helpers";
import { elkApproach, visApproach } from "./happi-graph.algorithms";

interface Props {
  algorithm?: string;
  selectedNodeId: string;
  data: any;
  debug?: boolean;
  graphDirection?: string;
  nodeCountLimit?: number;
  nodeDistanceX?: number;
  nodeDistanceY?: number;
}

interface State {
  algorithm: string;
  data: any;
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
}

class HappiGraph extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const mappedNodes = mapNodes(props.data.nodes, props.selectedNodeId);
    const mappedLinks = mapLinks(props.data.edges, mappedNodes);

    this.state = {
      algorithm: props.algorithm ? props.algorithm : 'ELK',
      data: { ...props.data },
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
      svg: null
    };
  }

  selectAlgorithm() {
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
            nodes: finalNodes,
            links: finalLinks,
            isLoading: false
          });
        }

        if(graphDirection === 'HORIZONTAL') {
          elkApproach(nodes, links, graphDirection, nodeDistanceX, nodeDistanceY, (data: any) => {
            this.setState({
              isLoading: false,
              nodes: [...data.nodes],
              links: [...data.links]
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
          ...this.state,
          nodes: finalNodes,
          links: finalLinks
        });

        break;
      default:
        console.log('NO_ALGORITHM_SELECTED');

        break;
    }
  }

  componentDidMount() {
    const { happiGraph } = this.state;

    this.setState({
      svg: d3.select(happiGraph.current)
    });

    this.selectAlgorithm();
  }

  componentDidUpdate() {
    const { svg } = this.state;

    if(svg) {
      // START

      // this.selectAlgorithm();

      console.log(this.state);
    }
  }

  init() {
    // const { algorithm, graphDirection } = this.state;
  }

  render() {
    const { happiGraph } = this.state;

    return (<>
      <svg id="happi-graph" ref={happiGraph}></svg>
    </>);
  }
}

export default HappiGraph;