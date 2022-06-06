import { mapLinks, mapNodes } from './happi-graph.helpers';

const nodes: any = [
  {
    "id": "ID",
    "label": "This is a label example",
    "group": "GlossaryCategory",
    "properties": {
      "glossary": "Bucket 1"
    },
    "level": 0,
    "qualifiedName": "(category)=Bucket 1::(category)=This is a label example"
  },
  {
    "id": "ID-02",
    "label": "This is a label example 2",
    "group": "GlossaryCategory",
    "properties": {
      "glossary": "Bucket 2"
    },
    "level": 0,
    "qualifiedName": "(category)=Bucket 2::(category)=This is a label example"
  }
];

const links: any = [
  {
    "from": "ID",
    "to": "ID-02",
    "label": "SemanticAssignment",
    "type": null
  }
];

describe("<HappiGraph />", () => {
  test("mapLinks(links, nodes)", () => {
    const linksInput: any = [...links];
    const nodesInput: any = [...nodes];
    const result = [
      {
        "connectionFrom": false,
        "connectionTo": true,
        "from": {
          "group": "GlossaryCategory",
          "id": "ID",
          "label": "This is a label example",
          "level": 0,
          "properties": {
            "glossary": "Bucket 1"
          },
          "qualifiedName": "(category)=Bucket 1::(category)=This is a label example"
        },
        "id": "ID-ID-02",
        "label": "SemanticAssignment",
        "source": "ID",
        "target": "ID-02",
        "to": {
          "group": "GlossaryCategory",
          "id": "ID-02",
          "label": "This is a label example 2",
          "level": 0,
          "properties": {
            "glossary": "Bucket 2"
          },
          "qualifiedName": "(category)=Bucket 2::(category)=This is a label example"
        },
        "type": null
      }
    ];

    expect(mapLinks(linksInput, nodesInput)).toEqual([...result]);
  });

  test("mapNodes(nodes)", () => {
    const result: any = [
      {
        "height": 100,
        "id": "ID",
        "label": "GlossaryCategory",
        "properties": [
          {
            "groupName": "Glossary",
            "icon": "simple-square",
            "label": "glossary",
            "value": "Bucket 1",
          },
        ],
        "selected": false,
        "type": "simple-square",
        "value": "This is a label example",
        "width": 300,
      },
      {
        "height": 100,
        "id": "ID-02",
        "label": "GlossaryCategory",
        "properties": [
          {
            "groupName": "Glossary",
            "icon": "simple-square",
            "label": "glossary",
            "value": "Bucket 2",
          },
        ],
        "selected": false,
        "type": "simple-square",
        "value": "This is a label example 2",
        "width": 300,
      }
    ];

    expect(mapNodes(nodes, "")).toEqual(result);

    const selectedResult: any = [
      {
        ...result[0],
        "selected": true
      },
      {
        "height": 100,
        "id": "ID-02",
        "label": "GlossaryCategory",
        "properties": [
          {
            "groupName": "Glossary",
            "icon": "simple-square",
            "label": "glossary",
            "value": "Bucket 2",
          },
        ],
        "selected": false,
        "type": "simple-square",
        "value": "This is a label example 2",
        "width": 300,
      }
    ];

    expect(mapNodes(nodes, "ID")).toEqual(selectedResult);
  });
});