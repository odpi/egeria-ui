import React from 'react';
import { Modal, Table, ActionIcon } from '@mantine/core';
import {
  BsCardChecklist
} from 'react-icons/bs';


interface Props {
  nodes?: any;
  links?: any;
}

interface State {
  data: any;
  opened: boolean;
}

/**
 *
 * React component used for displaying Action buttons.
 *
 * @since      0.1.0
 * @access     public
 *
 */
class HappiGraphListOfRelationships extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      data: this.generateData(props.nodes, props.links),
      opened: false
    }
  }

  generateData(nodes: any, links: any) {
    let graphMappings: any = [];

    if(links.length) {
      graphMappings = [
        ...Object(links).map((e: any) => {
          let fromNode = nodes
              .filter((n: any) => n.id === e.from)
              .pop();
          let toNode = nodes
              .filter((n: any) => n.id === e.to)
              .pop();
          return {
            from: fromNode,
            mapping: e.label,
            to: toNode
          };
        })
      ];
    }

    return graphMappings;
  }

  setOpened(value: boolean) {
    this.setState({
      opened: value
    });
  }

  render() {
    const { data, opened } = this.state;

    return (<>
      <ActionIcon title="List of Relationships" variant="hover" size={35}>
        <BsCardChecklist size={25} onClick={() => this.setOpened(true)} />
      </ActionIcon>


      <Modal
        opened={opened}
        onClose={() => this.setOpened(false)}
        centered
        size={'60%'}
        title="List of Relationships"
      >
        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>From</th>
              <th>Mapping</th>
              <th>To</th>
            </tr>
          </thead>
          <tbody>
            { data &&  data.map((d: any, i: number) => (
              <tr key={i}>
                <td>{d.from.label}</td>
                <td>{d.mapping}</td>
                <td>{d.to.label}</td>
              </tr>
            )) }
          </tbody>
        </Table>
      </Modal>
    </>);
  }
}

export default HappiGraphListOfRelationships;
