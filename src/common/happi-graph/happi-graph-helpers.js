import * as d3 from 'd3';

export const simpleSquareIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0H20V20H0V0Z" fill="white"/></svg>`;

export const isSelected = (nodeGroup) => {
  nodeGroup
    .append('path')
    .classed('pin', true)
    .attr('d', (d) => {
      if (d.selected) {
        return 'M7 2h10v2l-2 1v5l3 3v3h-5v4l-1 3l-1-3v-4H6v-3l3-3V5L7 4z';
      }
    })
    .attr('transform', (d) => {
      let x = d.width - 25;
      let y = 5;

      return `translate(${x} ${y}) rotate(30 0 0)`;
    });
};

export const addHeader = (nodeGroup) => {
  let header =
  nodeGroup
      .append('g')
      .classed('header', true);

  let textHeader =
    header.append('text')
      .attr('transform', `translate(70, 30)`)
      .attr('data-text-length', (d) => d.value.length)
      .attr('data-value', (d) => d.value)
      .classed('value', true)
      .text((d) => d.value.length > 18 ? `${d.value.substring(0, 18)}...` : d.value)

  textHeader
    .on('mouseover', function (d) {
      let currentNode = d3.select(this);

      let textLength = parseInt(currentNode.attr('data-text-length'));

      if(textLength > 18) {
        let value = currentNode.attr('data-value');

        let fullHeaderBackground =
          d3.select(this.parentNode)
            .append('rect')
            .classed('full-header-background', true)
            .attr('transform', `translate(20, -10)`)
            .attr('rx', 10)
            .attr('ry', 10);

        let fullHeader =
          d3.select(this.parentNode)
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
    .on('mouseout', function (d) {
      let currentNode = d3.select(this);

      let textLength = parseInt(currentNode.attr('data-text-length'));

      if(textLength > 18) {
        d3.select(this.parentNode.getElementsByClassName('full-header-background')[0]).remove();
        d3.select(this.parentNode.getElementsByClassName('full-header')[0]).remove();
      }
    });

  header.append('text')
    .attr('transform', `translate(70, 50)`)
    .classed('label', true)
    .text((d) => d.label);
};

export const addIcon = (nodeGroup, iconsMap) => {
  nodeGroup
    .append('path')
    .attr('transform', `translate(20,17)`)
    .attr('d', 'M40.5566 15.6865C41.4498 17.2335 41.4498 19.1395 40.5566 20.6865L32.9434 33.8731C32.0502 35.4201 30.3996 36.3731 28.6132 36.3731H13.3868C11.6004 36.3731 9.94979 35.4201 9.05662 33.8731L1.44338 20.6865C0.550212 19.1395 0.550212 17.2335 1.44338 15.6865L9.05662 2.5C9.94979 0.952994 11.6004 0 13.3868 0H28.6132C30.3996 0 32.0502 0.952995 32.9434 2.5L40.5566 15.6865Z')
    .attr('fill', '#5C82EB');

  nodeGroup.each(function (d) {
    let icon = new DOMParser()
      .parseFromString(
        iconsMap[d.type] ? iconsMap[d.type] : simpleSquareIcon,
        'application/xml'
      )
      .documentElement;

    d3.select(this)
      .append('g')
      .attr('transform', `translate(31,25)`)
      .node()
      .append(icon);
  })
};

export const addProperties = (nodeGroup, iconsMap) => {
  nodeGroup.each(function (d) {
    d3.select(this)
      .call(function (selection) {
        if (d.properties) {
          let labelHeight = 80;
          let iconHeight = 80;

          for (const p of d.properties) {
            let propertyGroup = selection.append('g').classed('property-group', true);

            let property = propertyGroup
                            .append('text')
                            .attr('transform', `translate(95, ${labelHeight})`)
                            .attr('data-text-length', p.value.length)
                            .attr('data-label-height', labelHeight)
                            .attr('data-value', p.value)
                            .classed('property', true)
                            .text(() => p.value.length > 10 ? `${p.value.substring(0, 10)}...` : p.value);

            property
              .on('mouseover', function (d) {

                let currentNode = d3.select(this);

                let textLength = parseInt(currentNode.attr('data-text-length'));

                if(textLength > 10) {
                  let dataLabelHeight = parseInt(currentNode.attr('data-label-height'));
                  let value = currentNode.attr('data-value');

                  let fullPropertyBackground = d3.select(this.parentNode)
                                      .append('rect')
                                      .classed('full-property-background', true)
                                      .attr('transform', `translate(70, ${dataLabelHeight - 40})`);

                  let fullProperty = d3.select(this.parentNode)
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
                let currentNode = d3.select(this);

                let textLength = parseInt(currentNode.attr('data-text-length'));

                if(textLength > 10) {
                  d3.select(this.parentNode.getElementsByClassName('full-property-background')[0]).remove();
                  d3.select(this.parentNode.getElementsByClassName('full-property')[0]).remove();
                }
              });

            let icon = new DOMParser()
              .parseFromString(
                iconsMap[p.icon] ? iconsMap[p.icon] : simpleSquareIcon,
                'application/xml'
              )
              .documentElement;

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
  })
};

export const getNodeHeight = (length) => {
  let defaultHeight = 70;

  let computedHeight =
    (length >= 1 ? (length * 30) : 0);

  return defaultHeight + computedHeight;
};