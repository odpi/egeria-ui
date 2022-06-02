import * as d3 from 'd3';
import { iconsMap, linksTypeIconMap, itemGroupIconMap } from "egeria-js-commons";

export const simpleSquareIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0H20V20H0V0Z" fill="white"/></svg>`;

export const addProperties = (nodeGroup: any) => {
  nodeGroup.each(function (d: any) {
    // @ts-ignore
    d3.select(this)
      .call(function (selection) {
        if (d.properties) {
          let labelHeight = 80;
          let iconHeight = 80;
          let PROPERTY_MAX_LENGTH = 20;

          for (const p of d.properties) {
            let propertyGroup = selection.append('g').classed('property-group', true);

            let property = propertyGroup
                            .append('text')
                            .attr('transform', `translate(95, ${labelHeight})`)
                            .attr('data-text-length', p.value.length)
                            .attr('data-label-height', labelHeight)
                            .attr('data-value', p.value)
                            .classed('property', true)
                            .text(() => p.value.length > PROPERTY_MAX_LENGTH ? `${p.value.substring(0, PROPERTY_MAX_LENGTH)}...` : p.value);

            property
             .on('mouseover', function (d: any) {
                let currentNode = d3.select(d.currentTarget);

                let textLength = parseInt(currentNode.attr('data-text-length'));

                if(textLength > PROPERTY_MAX_LENGTH) {
                  let dataLabelHeight = parseInt(currentNode.attr('data-label-height'));
                  let value = currentNode.attr('data-value');

                  let fullPropertyBackground = d3.select(d.currentTarget.parentNode)
                                      .append('rect')
                                      .classed('full-property-background', true)
                                      .attr('transform', `translate(70, ${dataLabelHeight - 40})`);

                  let fullProperty: any = d3.select(d.currentTarget.parentNode)
                                        .append('text')
                                        .classed('full-property', true)
                                        .attr('transform', `translate(78, ${dataLabelHeight - 32})`)
                                        .text(() => value);

                  let localBBox = fullProperty.node().getBBox();

                  fullPropertyBackground.attr('x', localBBox.x)
                                        .attr('y', localBBox.y)
                                        .attr('width', localBBox.width + 18)
                                        .attr('height', localBBox.height + 16)
                                        .attr('rx', 10)
                                        .attr('ry', 10);
                }
              })
              .on('mouseout', function (d) {
                let currentNode = d3.select(d.currentTarget);

                let textLength = parseInt(currentNode.attr('data-text-length'));

                if(textLength > 10) {
                  d3.select(d.currentTarget.parentNode.getElementsByClassName('full-property-background')[0]).remove();
                  d3.select(d.currentTarget.parentNode.getElementsByClassName('full-property')[0]).remove();
                }
              });

            let icon = new DOMParser()
              .parseFromString(
                iconsMap[p.icon] ? iconsMap[p.icon] : iconsMap['simple-square'],
                'application/xml'
              )
              .documentElement;

            // @ts-ignore: Object is possibly 'null'.
            propertyGroup
              .append('g')
              .attr('transform', `translate(65, ${iconHeight - 15})`)
              .classed('property-icon', true)
              .node()
              .append(icon);

            iconHeight = iconHeight + 30;

            labelHeight = labelHeight + 30;
          }
        }
      });
  });
};

export const addIcon = (nodeGroup: any, iconsMap: any) => {
  nodeGroup
    .append('path')
    .attr('transform', `translate(20,17)`)
    .attr('d', 'M40.5566 15.6865C41.4498 17.2335 41.4498 19.1395 40.5566 20.6865L32.9434 33.8731C32.0502 35.4201 30.3996 36.3731 28.6132 36.3731H13.3868C11.6004 36.3731 9.94979 35.4201 9.05662 33.8731L1.44338 20.6865C0.550212 19.1395 0.550212 17.2335 1.44338 15.6865L9.05662 2.5C9.94979 0.952994 11.6004 0 13.3868 0H28.6132C30.3996 0 32.0502 0.952995 32.9434 2.5L40.5566 15.6865Z')
    .attr('fill', '#5C82EB');

  nodeGroup.each(function (d: any) {
    let icon = new DOMParser()
      .parseFromString(
        iconsMap[d.type] ? iconsMap[d.type] : simpleSquareIcon,
        'application/xml'
      )
      .documentElement;

      // @ts-ignore: Object is possibly 'null'.
      d3.select(this)
        .append('g')
        .attr('transform', `translate(31,25)`)
        .node()
        .append(icon);
  })
};

const isSelected = (nodeGroup: any) => {
  nodeGroup
    .append('path')
    .classed('pin', true)
    .attr('d', (d: any) => {
      if (d.selected) {
        return 'M7 2h10v2l-2 1v5l3 3v3h-5v4l-1 3l-1-3v-4H6v-3l3-3V5L7 4z';
      }
    })
    .attr('transform', (d: any) => {
      let x = d.width - 25;
      let y = 5;

      return `translate(${x} ${y}) rotate(30 0 0)`;
    });
};

const addHeader = (nodeGroup: any) => {
  let header = nodeGroup
                .append('g')
                .classed('header', true);

  let textHeader =
    header.append('text')
      .attr('transform', `translate(70, 30)`)
      .attr('data-text-length', (d: any) => { return d.value.length; })
      .attr('data-value', (d: any) => d.value)
      .classed('value', true)
      .text((d: any) => d.value.length > 18 ? `${d.value.substring(0, 18)}...` : d.value)

  textHeader
    .on('mouseover', function (d: any) {
      let currentNode = d3.select(d.currentTarget);

      let textLength = parseInt(currentNode.attr('data-text-length'));

      if(textLength > 18) {
        let value = currentNode.attr('data-value');

        let fullHeaderBackground =
          d3.select(d.currentTarget.parentNode)
            .append('rect')
            .classed('full-header-background', true)
            .attr('transform', `translate(20, -10)`)
            .attr('rx', 10)
            .attr('ry', 10);

        let fullHeader: any =
          d3.select(d.currentTarget.parentNode)
            .append('text')
            .classed('full-header', true)
            .attr('transform', `translate(30, 0)`)
            .text(() => value);

        let localBBox = fullHeader.node().getBBox();

        fullHeaderBackground
          .attr('x', localBBox.x)
          .attr('y', localBBox.y)
          .attr('width', localBBox.width + 20)
          .attr('height', localBBox.height + 20);
      }
    })
    .on('mouseout', function (d: any) {
      let currentNode = d3.select(d.currentTarget);

      let textLength = parseInt(currentNode.attr('data-text-length'));

      if(textLength > 18) {
        d3.select(d.currentTarget.parentNode.getElementsByClassName('full-header-background')[0]).remove();
        d3.select(d.currentTarget.parentNode.getElementsByClassName('full-header')[0]).remove();
      }
    });

  header.append('text')
    .attr('transform', `translate(70, 50)`)
    .classed('label', true)
    .text((d: any) => d.label);
};

const addNodes = (nodes: any, nodesGroup: any, graphDirection: string) => {
  let _nodesGroup: any = nodesGroup
                          .selectAll()
                          .data(nodes)
                          .enter();

  let nodeGroup =
    _nodesGroup
      .append('g')
      .classed('node-group', true)
      .attr('id', (d: any) => d.id)
      .on('click', () => { console.log('CLICKED'); })
      .attr('transform', (d: any) => `translate(${d.x}, ${d.y})`)
      .call(
        d3.drag()
          .on('start', (d) => {
            // console.log('DRAG_START', d);
          })
          .on('drag', function(event: any, d: any) {
            d.x = event.x;

            if(graphDirection !== 'VERTICAL') {
              d.y = event.y;
            }

            console.log(event);

            d3.select(this)
              .attr('transform', `translate(${d.x}, ${d.y})`);

              let _links: any =
                  d3.selectAll('.links-group')
                    .selectAll('line');

              console.log(_links
                .filter(function(_d: any) {
                  return _d.from.id === d.id;
                }));

            _links
              .filter(function(_d: any) {
                return _d.from.id === d.id;
              })
              .attr('x1', (_d: any) => {
                let { from, to } = getLinkCoordinates(_d.from, _d.to, graphDirection);

                return from.x;
              })
              .attr('y1', (_d: any) => {
                let { from, to } = getLinkCoordinates(_d.from, _d.to, graphDirection);

                return from.y;
              })
              .attr('x2', (_d: any) => {
                let { from, to } = getLinkCoordinates(_d.from, _d.to, graphDirection);

                return to.x;
              })
              .attr('y2', (_d: any) => {
                let { from, to } = getLinkCoordinates(_d.from, _d.to, graphDirection);

                return to.y;
              });

            _links
              .filter(function(_d: any) {
                return _d.to.id === d.id;
              })
              .attr('x1', (_d: any) => {
                let { from, to } = getLinkCoordinates(_d.from, _d.to, graphDirection);

                return from.x;
              })
              .attr('y1', (_d: any) => {
                let { from, to } = getLinkCoordinates(_d.from, _d.to, graphDirection);

                return from.y;
              })
              .attr('x2', (_d: any) => {
                let { from, to } = getLinkCoordinates(_d.from, _d.to, graphDirection);

                return to.x;
              })
              .attr('y2', (_d: any) => {
                let { from, to } = getLinkCoordinates(_d.from, _d.to, graphDirection);

                return to.y;
              });
          })
          .on('end', (d) => {
            // console.log('DRAG_END', d);
          })
      );

  nodeGroup
    .append('rect')
    .attr('width', (d: any) => d.width)
    .attr('height', (d: any) => d.height)
    .classed('node', true)
    .classed('is-selected', (d: any) => d.selected)
    .attr('rx', 20)
    .attr('ry', 20);

    isSelected(nodeGroup);
    addHeader(nodeGroup);
    addIcon(nodeGroup, iconsMap);
    addProperties(nodeGroup);
};


const centerToCoordinates = function (data: any, scaledBy: any, svg: any, zoom: any) {
  let { x, y, width, height } = data;

  let svgWidth = parseInt(svg.style('width'));
  let svgHeight = parseInt(svg.style('height'));

  let svgCenter = {
    x: svgWidth / 2,
    y: svgHeight / 2
  };

  svg.transition()
    .call(
      zoom.transform,
      d3.zoomIdentity
        .translate(
          svgCenter.x - ((x * scaledBy) + (width * scaledBy) / 2),
          svgCenter.y - ((y * scaledBy) + (height * scaledBy) / 2)
        )
        .scale(scaledBy)
    )
}

const centerGraph = (allGroup: any, svg: any, zoom: any) => {
  let graphBBox = allGroup.node().getBBox();

  let svgWidth = parseInt(svg.style('width'));
  let svgHeight = parseInt(svg.style('height'));

  let data = {
    x: graphBBox.x,
    y: graphBBox.y,
    width: graphBBox.width,
    height: graphBBox.height
  };

  let scaledBy = Math.min(
    (svgWidth - 100) / graphBBox.width,
    (svgHeight - 100) / graphBBox.height,
    1
  );

  centerToCoordinates(data, scaledBy, svg, zoom);
}

const customZoom = (value: number, zoom: any, svg: any) => {
  if (value > 0) {
    zoom.scaleBy(svg.transition(), 1.3);
  } else {
    zoom.scaleBy(svg.transition(), 0.7);
  }
};

const customZoomIn = (zoom: any, svg: any) => {
  customZoom(1, zoom, svg);
};

const customZoomOut = (zoom: any, svg: any) => {
  customZoom(-1, zoom, svg);
};

export const relativeTo = (nodeA: any, nodeB: any, graphDirection: string) => {
  let a = {
    x1: nodeA.x,
    y1: nodeA.y,
    x2: nodeA.x + nodeA.width,
    y2: nodeA.y + nodeA.height
  };

  let b = {
    x1: nodeB.x,
    y1: nodeB.y,
    x2: nodeB.x + nodeB.width,
    y2: nodeB.y + nodeB.height
  };

  if((a.x1 < b.x2) && !(a.x2 > b.x1) && (a.y1 < b.y2) && (a.y2 > b.y1)) {
    return { a: 'RIGHT', b: 'LEFT' };
  }

  if((a.x1 < b.x2) && !(a.x2 > b.x1) && !(a.y1 < b.y2) && (a.y2 > b.y1)) {
    return graphDirection === 'VERTICAL' ? { a: 'TOP', b: 'BOTTOM' } : { a: 'RIGHT', b: 'LEFT' };
  }

  if((a.x1 < b.x2) && !(a.x2 > b.x1) && (a.y1 < b.y2) && !(a.y2 > b.y1)) {
    return { a: 'RIGHT', b: 'LEFT' };
  }

  if((a.x1 < b.x2) && (a.x2 > b.x1) && (a.y1 < b.y2) && !(a.y2 > b.y1)) {
    return { a: 'BOTTOM', b: 'TOP' };
  }

  if(!(a.x1 < b.x2) && (a.x2 > b.x1) && (a.y1 < b.y2) && !(a.y2 > b.y1)) {
    return { a: 'LEFT', b: 'RIGHT' };
  }

  if(!(a.x1 < b.x2) && (a.x2 > b.x1) && (a.y1 < b.y2) && (a.y2 > b.y1)) {
    return { a: 'LEFT', b: 'RIGHT' };
  }

  if(!(a.x1 < b.x2) && (a.x2 > b.x1) && !(a.y1 < b.y2) && (a.y2 > b.y1)) {
    return graphDirection === 'VERTICAL' ? { a: 'TOP', b: 'BOTTOM' } : { a: 'LEFT', b: 'RIGHT' };
  }

  if((a.x1 < b.x2) && (a.x2 > b.x1) && !(a.y1 < b.y2) && (a.y2 > b.y1)) {
    return { a: 'TOP', b: 'BOTTOM' };
  }

  if((a.x1 < b.x2) && (a.x2 > b.x1) && (a.y1 < b.y2) && (a.y2 > b.y1)) {
    return { a: 'RIGHT', b: 'RIGHT' };
  }
};

export const getNodeAnchorPoint = (node: any, point: any) => {
  let { width, height } = node;

  switch(point) {
    case 'TOP':
        return { x: node.x + (width / 2), y: node.y };
    case 'BOTTOM':
        return { x: node.x + (width / 2), y: node.y + height };
    case 'LEFT':
        return { x: node.x, y: node.y + (height / 2)};
    case 'RIGHT':
        return { x: node.x + width, y: node.y + (height / 2)};
    default:
      console.log('WRONG_ANCHOR_POINT_SELECTED');
      break;
  }
};

export const getLinkCoordinates = (nodeA: any, nodeB: any, graphDirection: string) => {
  let _relativeTo: any = relativeTo(nodeA, nodeB, graphDirection);


  let from: any = getNodeAnchorPoint(nodeA, _relativeTo.a);
  let to: any = getNodeAnchorPoint(nodeB, _relativeTo.b);

  return {
    from: { x: from.x, y: from.y },
    to: { x: to.x, y: to.y }
  };
};

const addLinks = (links: any, linksGroup: any, graphDirection: string, nodes: any) => {
  let _linksGroup = linksGroup.selectAll()
    .data(links)
    .enter();

  _linksGroup
    .append('line')
    .classed('link', true)
    .attr('label', (d: any) => {
      return d.label;
    })
    .attr('stroke-dasharray', (d: any) => {
      return linksTypeIconMap[d.type] ? linksTypeIconMap[d.type].strokeDashArray : null;
    })
    .attr('marker-start', (d: any) => (d.connectionFrom) ? 'url(#arrow-start)' : null)
    .attr('marker-end', (d: any) => (d.connectionTo) ? 'url(#arrow-end)' : null)
    .attr('from', function(d: any) { return d.from.id; })
    .attr('to', function(d: any) { return d.to.id; })
    .attr('x1', (d: any) => {
      let { from } = getLinkCoordinates(d.from, d.to, graphDirection);

      return from.x;
    })
    .attr('y1', (d: any) => {
      let { from } = getLinkCoordinates(d.from, d.to, graphDirection);

      return from.y;
    })
    .attr('x2', (d: any) => {
      let { to } = getLinkCoordinates(d.from, d.to, graphDirection);

      return to.x;
    })
    .attr('y2', (d: any) => {
      let { to } = getLinkCoordinates(d.from, d.to, graphDirection);

      return to.y;
    })
    .on('mouseover', function(d: any) {
      let position = d.currentTarget.ownerSVGElement.createSVGPoint();

      position.x = d.x;
      position.y = d.y;

      position = position.matrixTransform(d.currentTarget.getScreenCTM().inverse());

      let linkLabel = d.currentTarget.attributes.label.value;
      let sourceLabel = nodes.filter((n: any) => n.id === d.currentTarget.attributes.from.value ).pop().value;
      let targetLabel = nodes.filter((n: any) => n.id === d.currentTarget.attributes.to.value ).pop().value;

      let textBackground =
          d3.select(d.currentTarget.parentNode)
              .append('rect')
              .classed('link-popup-box', true)
              .attr('transform', `translate(20, -10)`)
              .style("fill", "#ffffff")
              .style("stroke", "#cccccc")
              .attr('rx', 10)
              .attr('ry', 10);

      let text: any =
          d3.select(d.currentTarget.parentNode)
              .append('text')
              .classed('link-popup-text', true)
              .attr('transform', `translate(30, 0)`)
              .attr('x', position.x + 10)
              .attr('y', position.y + 10)
              .text(() => `${sourceLabel} :: ${linkLabel} :: ${targetLabel}`);

      let bBox: any = text.node().getBBox();

      textBackground
          .attr('x', bBox.x)
          .attr('y', bBox.y)
          .attr('height', bBox.height + 20)
          .attr('width', bBox.width + 20);
    })
    .on('mouseout', (d: any) => {
      d.currentTarget.parentNode.getElementsByClassName('link-popup-box')[0].remove();
      d.currentTarget.parentNode.getElementsByClassName('link-popup-text')[0].remove();
    })
    .on('click', (d: any) => {
        let clicked = d3.select(d.currentTarget);

        if (clicked.classed('link-clicked')) {
          clicked
            .attr('marker-start', (d: any) => (d.connectionFrom) ? 'url(#arrow-start)' : null)
            .attr('marker-end', (d: any) => (d.connectionTo) ? 'url(#arrow-end)' : null)
            .classed('link-clicked', false);
        } else {
          clicked
            .attr('marker-start', (d: any) => (d.connectionFrom) ? 'url(#arrow-start-selected)' : null)
            .attr('marker-end', (d: any) => (d.connectionTo) ? 'url(#arrow-end-selected)' : null)
            .classed('link-clicked', true);
        }
    })
}

export {
  addNodes,
  addLinks,
  centerGraph,
  customZoom,
  customZoomIn,
  customZoomOut,
  linksTypeIconMap,
  iconsMap,
  itemGroupIconMap
}
