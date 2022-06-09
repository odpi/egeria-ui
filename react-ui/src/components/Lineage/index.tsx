import React from "react";

import {
  HappiGraph,
  HappiGraphActions
} from 'happi-graph';

import 'happi-graph/src/components/happi-graph.scss';


import { mockData } from "../../mockData";


const rawData = {
  ...mockData
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
      <HappiGraph rawData={{...rawData}}
                  algorithm={""}
                  graphDirection={"VERTICAL"}
                  selectedNodeId={"term@68e36496-7167-4af7-abdd-a0cd36e24084:6662c0f2.e1b1ec6c.66k78i6du.uchsna1.rn2epa.rfn2fjqf7h4qvmt5lflm8"}
                  actions={<HappiGraphActions rawData={{...rawData}}/>} />
    </>);
  }
}

export default Lineage;