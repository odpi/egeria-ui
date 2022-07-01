import React from "react";
import { Accordion, LoadingOverlay, Paper, Text } from '@mantine/core';
import { capitalize } from "../../helpers/commons";

interface Props {
}

interface State {
  data: {
    loaded: boolean,
    name: String,
    version: String,
    commitId: String,
    buildTime: String
  }
}

/**
 *
 * React component used for displaying details about the application instance.
 *
 * @since      0.1.0
 * @access     public
 *
 */
class About extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      data: {
        loaded: false,
        name: '',
        version: '',
        commitId: '',
        buildTime: ''
      }
    };
  }

  componentDidMount() {
    fetch(`/about.json`)
      .then(data => {
        return data.json()
      })
      .then(data => {
        this.setState({
          data: {
            ...data,
            loaded: true
          }
        });
      });
  }

  render() {
    const { data } = this.state;

    return (<>
      <div style={{ height:'100%', position: 'relative' }}>
        <LoadingOverlay visible={!data.loaded} />

        <Paper shadow="xs" p="md" style={{height: '100%'}}>
          <Text size="xl">About</Text>
          <Accordion>
            { Object.keys(data).filter(k => k !== 'loaded').map((k, index) => {
              return (
                <Accordion.Item label={capitalize(k)} key={index}>
                  {/* @ts-ignore */}
                  { capitalize(data[k]) }
                </Accordion.Item>
              );
            }) }
          </Accordion>
        </Paper>
      </div>
    </>);
  }
}

export default About;