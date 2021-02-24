import { happiGraphIconsMap } from './happi-graph-icons';

export const graphGroupIconMap = {
  AssetZoneMembership: {
    icon: 'simple-square'
  },
  Category: {
    icon: 'carbon-category'
  },
  Column: {
    icon: 'simple-square'
  },
  condensedNode: {
    icon: 'simple-square'
  },
  Connection: {
    icon: 'mdi-transit-connection-variant'
  },
  Database: {
    icon: 'dashicons-database'
  },
  DataFile: {
    icon: 'bi-file-earmark'
  },
  DisplayName: {
    icon: 'simple-square'
  },
  Endpoint: {
    icon: 'simple-square'
  },
  FileFolder: {
    icon: 'bi-folder'
  },
  Glossary: {
    icon: 'carbon-data-structured'
  },
  GlossaryCategory: {
    icon: 'carbon-category'
  },
  GlossaryTerm: {
    icon: 'ion-list-circle-outline'
  },
  Path: {
    icon: 'file-icons-microsoft-infopath'
  },
  Process: {
    icon: 'whh-cog'
  },
  RelationalColumn: {
    icon: 'mdi-table-column'
  },
  RelationalTable: {
    icon: 'bi-table'
  },
  Schema: {
    icon: 'system-uicons-hierarchy'
  },
  subProcess: {
    icon: 'mdi-cogs'
  },
  TabularColumn: {
    icon: 'carbon-column'
  },
  TransformationProject: {
    icon: 'file-icons-microsoft-project'
  }
};

export const getIconByGroup = (groupName) => {
  if( graphGroupIconMap[groupName] !== undefined) {
    return happiGraphIconsMap[graphGroupIconMap[groupName].icon];
  }
  else {
    return happiGraphIconsMap['simple-square'];
  }
};
