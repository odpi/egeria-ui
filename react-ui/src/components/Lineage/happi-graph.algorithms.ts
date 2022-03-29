import vis from 'vis-network';
import ELK from 'elkjs';


const visApproach = (nodes: any, links: any, graphDirection: string, nodeDistanceX: number, nodeDistanceY: number) => {
  let nodeMap: any = {};

  const _nodes: any = new vis.DataSet([
    ...nodes.map((n: any) => {
      let _node = {
        ...n,
        value2: n.value
      };

      nodeMap[n.id] = _node;

      return _node;
    })
  ]);

  const edges = new vis.DataSet([
    ...links.map((l: any) => {
      return {
        from: l.from.id,
        to: l.to.id
      };
    })
  ]);

 // /*
 var options = {
    autoResize: true,
    physics:{
      enabled:false,
      hierarchicalRepulsion: {
        avoidOverlap: 1,
      }
    },
    edges: {
      arrows: {
        to: {
          scaleFactor: 1
        }
      }
    },
    layout: {
      improvedLayout: false,
      hierarchical: {
        enabled:true,
        levelSeparation: nodeDistanceY,
        nodeSpacing: nodeDistanceX,
        treeSpacing: 200,
        direction: graphDirection === 'HORIZONTAL' ? 'LR' : 'DU', // UD, DU, LR, RL
        sortMethod: 'directed',  // hubsize, directed
        shakeTowards: 'leaves'  // roots, leaves
       }
    }
  };

  let data = {
    nodes: _nodes,
    edges: edges
  };

  let e = document.createElement('div');
  var network = new vis.Network(e, data, options);

  let positions = network.getPositions();

  const finalNodes = Object.keys(positions).map(id => {
    return {
      ...nodeMap[id],
      value: nodeMap[id].value2, // VisJS is somehow updating this value
      x: positions[id].x,
      y: positions[id].y
    };
  });

  const finalLinks = links.map((l: any) => {
    return {
      ...l,
      from: finalNodes.filter(n => n.id === l.from.id).pop(),
      to: finalNodes.filter(n => n.id === l.to.id).pop()
    }
  });

  return {
    nodes: [...finalNodes],
    links: [...finalLinks]
  };
};

const elkApproach = (nodes: any, links: any, graphDirection: string, nodeDistanceX: number, nodeDistanceY: number, callback: Function) => {
  const elk = new ELK({});

  const graph = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.spacing.nodeNode": `${nodeDistanceY}`,
      "elk.layered.spacing.baseValue": `${nodeDistanceX}`,
      "elk.direction": graphDirection === 'HORIZONTAL' ? 'RIGHT' : 'UP'
    },
    children: [
      ...nodes
    ],
    edges: [
      ...links
    ]
  };

  elk.layout(graph)
    .then((g: any) => {
      callback({
        nodes: [ ...g.children ],
        links: [ ...g.edges ]
      });
    })
    // .catch(console.error)
};

export {
  visApproach,
  elkApproach
}