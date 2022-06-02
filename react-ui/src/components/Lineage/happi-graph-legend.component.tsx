import React from 'react';

import { ActionIcon, Text, Switch } from '@mantine/core';

import {
  MdToggleOff,
  MdToggleOn
} from 'react-icons/md';

import {
  getIcon,
  getLegendCategories,
  getLegendLabels,
  graphLinksUpdateInLegendData,
  graphNodesUpdateInLegendData
} from './happi-graph-legend.render';

import { v4 as uuidv4 } from 'uuid';

interface Props {
  nodes: any;
  links: any;
}

interface State {
  nodes: any;
  links: any;
  isMinimised: boolean;
  legendData: any;
}

/**
 *
 * React component used for displaying Action buttons.
 *
 * @since      0.1.0
 * @access     public
 *
 */
class HappiGraphLegend extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      nodes: [...props.nodes],
      links: [...props.links],
      isMinimised: true,
      legendData: null
    };
  }

  toggleMinimise() {
    const { isMinimised } = this.state;
    this.setState({ isMinimised: !isMinimised });
  }

  componentDidMount() {
    const { nodes, links } = this.state;

    let data = {};

    data = {
      ...graphLinksUpdateInLegendData(links),
      ...graphNodesUpdateInLegendData(nodes)
    };

    console.log(data);

    this.setState({
      legendData: { ...data }
    });
  }

  render() {
    const { isMinimised, legendData } = this.state;

    return (<>
      <div className="happi-graph-legend">
        <div className="toggler">
          <Switch label="Legend" checked={!isMinimised} onClick={() => { this.toggleMinimise() }} />
        </div>

        <div className="contents">
          { legendData && !isMinimised && getLegendCategories(legendData).map((legendKey: any, legendKeyId: number) => {
            return <><div className="icon-title" key={uuidv4()}>
              <b>{ legendKey }</b>
            </div>

            <div className="svg-icons">
              { legendData && legendKey && getLegendLabels(legendData, legendKey).map((label: any, labelId: number) => {
                return <div className="svg-icon" key={uuidv4()}>
                  <img src={ `data:image/svg+xml;utf8,${ getIcon(legendKey, label, legendData) }` } alt="icon" />

                  <span>{ label }</span>
                </div>
              }) }
            </div>
          </>}) }
        </div>
      </div>
    </>);
  }
}

export default HappiGraphLegend;