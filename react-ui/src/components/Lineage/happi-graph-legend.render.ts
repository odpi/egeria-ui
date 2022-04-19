import {
  simpleSquareIcon,
  linksTypeIconMap,
  iconsMap
} from "./happi-graph.render";

export const getIcon = (type: any, label: any, legendData: any, propertiesMap: any) => {
  let iconName = legendData[type][label];

  if ((propertiesMap[iconName] && iconsMap[propertiesMap[iconName].icon])) {
    return iconsMap[propertiesMap[iconName].icon];
  } else if (linksTypeIconMap[iconName] && iconsMap[linksTypeIconMap[iconName].icon]) {
    return iconsMap[linksTypeIconMap[iconName].icon];
  } else {
    return simpleSquareIcon;
  }
};

export const getLabel = (group: any) => {
  return /*pluralize(*/ group /*)*/;
};

export const getLegendCategories = (legendData: any) => {
  return Object.keys(legendData);
};

export const getLegendLabels = (legendData: any, legendKey: any) => {
  return [
    // @ts-ignore
    ...new Set( Object.keys(legendData[legendKey]) )
  ];
};

export const graphLinksUpdateInLegendData = (newGraphLinks: any) => {
  let _links = newGraphLinks;
  let legendData: any = {};

  if (_links.length) {
    _links.map((l: any) => {
      if (l.type && linksTypeIconMap[l.type]) {
        let group = linksTypeIconMap[l.type].group;

        if (!legendData[group]) {
          legendData[group] = [];
        }
        legendData[group][linksTypeIconMap[l.type].label] = l.type;
      }
    });
  }

  return legendData;
}

export const graphNodesUpdateInLegendData = (newGraphNodes: any, propertiesMap: any) => {
  let _nodes = newGraphNodes;
  let legendData: any = {};

  if (_nodes.length) {
    _nodes.map((n: any) => {
      let group = propertiesMap[n.label].group;

      if (!legendData[group]) {
        legendData[group] = [];
      }

      legendData[group][n.label] = n.label;

      n.properties.map((p: any) => {
        if (propertiesMap[p.groupName]){
          let propertiesGroup = propertiesMap[p.groupName].group;

          legendData[propertiesGroup][p.groupName] = p.groupName;
        }
      });
    });
  }

  return legendData;
}