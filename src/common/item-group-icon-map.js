import { happiGraphIconsMap } from './happi-graph-icons';

export const itemGroupIconMap = {
  AssetZoneMembership: {
    icon: 'simple-square'
  },
  Category: {
    icon: 'carbon-category'
  },
  category: {
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
  Host: {
    icon: 'mdi-transit-connection-variant'
  },
  Database: {
    icon: 'dashicons-database'
  },
  DataFile: {
    icon: 'bi-file-earmark'
  },
  CSVFile: {
    icon: 'bi-file-earmark'
  },
  File: {
    icon: 'bi-file-earmark'
  },
  Database_schema: {
    icon: 'system-uicons-hierarchy'
  },
  Database_column: {
    icon: 'mdi-table-column'
  },
  Database_table: {
    icon: 'bi-table'
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
  Term: {
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
  if( itemGroupIconMap[groupName] !== undefined) {
    return happiGraphIconsMap[itemGroupIconMap[groupName].icon];
  }
  else {
    return happiGraphIconsMap['simple-square'];
  }
};
