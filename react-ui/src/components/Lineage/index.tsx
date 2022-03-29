import React from "react";
import HappiGraph from "./happi-graph.component";

const rawData = {
  "nodes": [],
  "edges": []
};

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
      <HappiGraph data={{...rawData}}
                  algorithm={""}
                  selectedNodeId={""} />
    </>);
  }
}

export default Lineage;