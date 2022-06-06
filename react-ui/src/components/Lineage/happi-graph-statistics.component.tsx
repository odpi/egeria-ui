import React from 'react';
import { Modal, Table, ActionIcon } from '@mantine/core';
import {
  IoMdStats
} from 'react-icons/io';

interface Props {
  nodes?: any;
}

interface State {
  data: any;
  opened: any;
}

/**
 *
 * React component used for displaying Action buttons.
 *
 * @since      0.1.0
 * @access     public
 *
 */
class HappiGraphStatistics extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      data: this.generateData(props.nodes),
      opened: false
    }
  }

  generateData(nodes: any) {
    let _nodes: any = nodes;

    let typeMap: any = {};
    let typeMapData: any = [];

    if(_nodes.length) {
      _nodes.forEach((n: any) => {
        if(typeMap[n.group]) {
          typeMap[n.group]++;
        } else {
          typeMap[n.group] = 1;
        }
      });

      typeMapData = [
        ...Object.keys(typeMap).map(k => {
          return {
            key: k,
            occurrences: typeMap[k]
          };
        })
      ];
    } else {
      typeMapData = [];
    }

    return typeMapData;
  }

  setOpened(value: boolean) {
    this.setState({
      opened: value
    });
  }

  render() {
    const { data, opened } = this.state;

    return (<>
      <ActionIcon title="Statistics" variant="hover" size={35}>
        <IoMdStats size={25} onClick={() => this.setOpened(true)} />
      </ActionIcon>

      <Modal
        opened={opened}
        onClose={() => this.setOpened(false)}
        centered
        title="Statistics"
      >
        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>Key</th>
              <th>Occurences</th>
            </tr>
          </thead>
          <tbody>
            { data &&  data.map((d: any, i: number) => (
              <tr key={i}>
                <td>{d.key}</td>
                <td>{d.occurrences}</td>
              </tr>
            )) }
          </tbody>
        </Table>
      </Modal>
    </>);
  }
}

export default HappiGraphStatistics;