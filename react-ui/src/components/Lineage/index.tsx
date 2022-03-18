import React from "react";
import HappiGraph from 'happi-graph/lib/cjs/HappiGraph';

interface Props {
}

interface State {
}

/**
 *
 * React component used for displaying the Home page.
 *
 * @since      0.1.0
 * @access     public
 *
 */
class Lineage extends React.Component<Props, State> {
  render() {
    return (<>
      <HappiGraph/>
    </>);
  }
}

export default Lineage;