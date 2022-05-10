import React from 'react';

interface Props {
  nodes?: any;
  links?: any;
}

interface State {
  data: any;
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

    console.log(props, 'props');

    this.state = {
      data: this.generateData(props.nodes, props.links)
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

  render() {
    const { data } = this.state;

    console.log('data', data);

    return (<>
      <button>List of Relationships</button>

      { data && data.map((d: any, i: number) => {
        return <div key={i}>{ d.from.label }: { d.mapping }: { d.to.label }</div>
      }) }
    </>);
  }
}

export default HappiGraphListOfRelationships;
