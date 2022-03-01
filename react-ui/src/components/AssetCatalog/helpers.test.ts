import {
  itemDescription,
  itemName,
  parseQualifiedName,
  capitalizeFirstLetter,
  getIcon
} from './helpers';

describe("AssetCatalog Helpers", () => {
  it("itemDescription()", () => {
    const data1 = {
      properties: {
        description: 'description'
      }
    };

    const data2 = {
      properties: {
        summary: 'summary'
      }
    };

    expect(itemDescription(data1)).toBe('description');
    expect(itemDescription(data2)).toBe('summary');
  });

  it("itemName()", () => {
    const data1 = {
      properties: {
        displayName: 'displayName'
      }
    };
    const data2 = {
      properties: {
        name: 'name'
      }
    };

    expect(itemName(data1)).toBe('displayName');
    expect(itemName(data2)).toBe('name');
  });

  it("parseQualifiedName()", () => {
    const qualifiedName = '(category)=Egeria Container::(category)=Egeria Container Terms::(category)=Other Data::(term)=Filename';

    expect(parseQualifiedName(qualifiedName)).toEqual([
      {"key": "category", "value": "Egeria Container"},
      {"key": "category", "value": "Egeria Container Terms"},
      {"key": "category", "value": "Other Data"},
      {"key": "term", "value": "Filename"}
    ]);
  });

  it("capitalizeFirstLetter()", () => {
    expect(capitalizeFirstLetter('egeria')).toBe('Egeria');
  });
});
