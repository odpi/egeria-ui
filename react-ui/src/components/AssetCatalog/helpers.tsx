import {
  getIconByGroup
} from 'egeria-js-commons';

const itemDescription = (item: any) => {
  if (item.properties.description && item.properties.description != null) {
    return item.properties.description;
  } else if (item.properties.summary && item.properties.summary != null) {
    return item.properties.summary;
  } else {
    return '';
  }
};

const itemName = (item: any) => {
  if (item.properties.displayName && item.properties.displayName != null) {
    return item.properties.displayName;
  } else if (item.properties.name && item.properties.name != null) {
    return item.properties.name;
  } else {
    return 'N/A';
  }
};

const parseQualifiedName = (str: any) => {
  let regexpNames = /\((?<key>\w+)\)=(?<value>[a-zA-Z0-9_ ]+)/mg;
  let response = [];
  let match = regexpNames.exec(str);

  do {
    if( !match || !match.groups ){
      return [{key:'qualifiedName',value:str}];
    }
    response.push(match.groups);
  } while ((match = regexpNames.exec(str)) !== null);

  return response;
};

const capitalizeFirstLetter = (str: any) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const getIcon = (groupName: string) => {
  return getIconByGroup(capitalizeFirstLetter(groupName));
}

export {
  itemDescription,
  itemName,
  parseQualifiedName,
  capitalizeFirstLetter,
  getIcon
};