import React from 'react';
import {
  BsToggle2Off,
  BsToggle2On
} from 'react-icons/bs';

import { MdToggleOff } from 'react-icons/md';

interface Props {
  nodes: any;
  links: any;
}

interface State {
  nodes: any;
  links: any;
  isMinimised: boolean;
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
      isMinimised: true
    };
  }

  toggleMinimise() {
    const { isMinimised } = this.state;
    this.setState({ isMinimised: !isMinimised });
  }

  render() {
    const { isMinimised } = this.state;

    return (<>
      <div className="happi-graph-legend-wrapper">
        { isMinimised && <BsToggle2Off size={40} onClick={() => { this.toggleMinimise() }}/> }
        { !isMinimised && <BsToggle2On size={40} onClick={() => { this.toggleMinimise() }}/> }
      </div>
    </>);
  }
}

export default HappiGraphLegend;