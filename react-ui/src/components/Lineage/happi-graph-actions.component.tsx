import React from 'react';
import HappiGraphStatistics from './happi-graph-statistics.component';

interface Props {
  zoomIn?: Function;
  rawData?: any;
}

interface State {
  nodes: any;
}

/**
 *
 * React component used for displaying Action buttons.
 *
 * @since      0.1.0
 * @access     public
 *
 */
class HappiGraphActions extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      nodes: props.rawData.nodes
    };
  }

  render() {
    const { nodes } = this.state;

    console.log(nodes, 'czr');

    return (<>
      <button>Click me</button>

      <HappiGraphStatistics nodes={[...nodes]}/>
    </>);
  }
}

export default HappiGraphActions;