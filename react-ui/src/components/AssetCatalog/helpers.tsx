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

export {
  itemDescription,
  itemName
};