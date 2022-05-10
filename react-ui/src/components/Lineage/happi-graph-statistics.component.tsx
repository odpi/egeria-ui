import React from 'react';

interface Props {
  nodes?: any;
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
class HappiGraphStatistics extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    console.log(props, 'props');

    this.state = {
      data: this.generateData(props.nodes)
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

  render() {
    const { data } = this.state;

    return (<>
      <button>Statistics</button>

      { data && data.map((d: any, i: number) => {
        return <div key={i}>{ d.key }: { d.occurrences }</div>
      }) }
    </>);
  }
}

export default HappiGraphStatistics;