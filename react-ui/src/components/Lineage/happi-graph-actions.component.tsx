import React from 'react';
import HappiGraphListOfRelationships from './happi-graph-list-of-relationships.component';
import HappiGraphStatistics from './happi-graph-statistics.component';

interface Props {
  zoomIn?: Function;
  rawData?: any;
}

interface State {
  nodes: any;
  links: any;
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
      nodes: props.rawData.nodes,
      links: props.rawData.edges
    };
  }

  render() {
    const { nodes, links } = this.state;

    return (<>
      <HappiGraphStatistics nodes={[...nodes]}/>
      <HappiGraphListOfRelationships nodes={[...nodes]} links={[...links]}/>
    </>);
  }
}

export default HappiGraphActions;