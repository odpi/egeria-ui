import React from "react";
import ReactDOM from "react-dom";
import { types } from '../../../services/user.service';
import { egeriaFetch } from '../../../helpers/egeria-fetch';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter.js';
import '@vaadin/vaadin-grid/vaadin-grid-sorter.js';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js';
import '@vaadin/vaadin-checkbox/vaadin-checkbox.js';
import { getComponent } from "../../../helpers/commons";
import { itemDescription, itemName } from "./helpers";
import QualifiedName from "./qualified-name";

interface Props {
  location: any;
}

interface State {
  data: any;
  q: String;
  types: Array<String>;
  selectedTypes: Array<String>;
  exactMatch: Boolean;
  caseSensitive: Boolean;
  pageSize: number;
  isLoading: Boolean;
}

/**
 *
 * React component used for AssetCatalog.
 *
 * @since      0.1.0
 * @access     public
 *
 */
class AssetCatalog extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      data: [],
      q: '',
      types: [],
      selectedTypes: [],
      exactMatch: false,
      caseSensitive: false,
      pageSize: 25,
      isLoading: false
    };
  }

  generateAssetSearchUrl() {
    const {
      q,
      selectedTypes,
      exactMatch,
      caseSensitive,
      pageSize
    } = this.state;

    let url = '/api/assets/search';

    if(q) {
      url = `${url}?q=${ q.trim() }`;
    }

    if(selectedTypes.length > 0) {
      url = `${url}&types=${ selectedTypes.join(',') }`;
    }

    if(exactMatch) {
      url = `${url}&exactMatch=${ exactMatch }`;
    }

    if(caseSensitive) {
      url = `${url}&caseSensitive=${ caseSensitive }`;
    }

    if (pageSize > 25) {
      url = `${url}&pageSize=${pageSize}`;
    }

    return url;
  }

  loadMore() {
    const { pageSize } = this.state;

    this.setState({
      pageSize: pageSize + 25
    }, () => {
      this.submit();
    });
  }

  handleSearchHistory() {
    const {
      q,
      selectedTypes,
      exactMatch,
      caseSensitive,
      pageSize
    } = this.state;

    let searchParams = [];

    if(q) {
      searchParams.push({'key': 'q', 'value': q.trim()});
    }

    if(selectedTypes.length) {
      searchParams.push({'key': 'selectedTypes', 'value': selectedTypes.join(',')});
    }

    if(exactMatch) {
      searchParams.push({'key': 'exactMatch', 'value': 'true' });
    }

    if(caseSensitive) {
      searchParams.push({'key': 'caseSensitive', 'value': 'true' });
    }

    if(pageSize) {
      searchParams.push({'key': 'pageSize', 'value': pageSize });
    }

    if (window.history.replaceState) {
        const url = window.location.protocol
                    + '//' + window.location.host
                    + window.location.pathname
                    + '?'
                    + searchParams.map(s => `${s.key}=${s.value}`).join('&');

        window.history.replaceState({
          path: url
        }, '', url)
    }
  }

  submit() {
    const combobox: any = getComponent('#types');
    const search: any = getComponent('#user-search');
    const exactMatch: any = getComponent('#exact-match');
    const caseSensitive: any = getComponent('#case-sensitive');
    const { q, selectedTypes } = this.state;
    const willSearch = q !== '' && selectedTypes.length > 0;

    this.setState({
      isLoading: willSearch ? true : false,
      selectedTypes: combobox.selectedItems.map((i: any) => i.id) || [],
      caseSensitive: caseSensitive.checked || false,
      exactMatch: exactMatch.checked || false,
      q: search.value || ''
    }, () => {
      const url = this.generateAssetSearchUrl();
      if(willSearch) {
        this.handleSearchHistory();

        egeriaFetch(url, {}).then(response => {
          return response.json();
        }).then(data => {
          this.setState({
            data: data,
            isLoading: false
          });
        }).catch(() => {
          // TODO: handle event for future generic alert implementation
          this.setState({
            isLoading: false
          });
        });
      }
    });
  }

  componentDidMount() {
    const displayName: any = getComponent('#display-name');
    const description: any = getComponent('#description');
    const qualifiedName: any = getComponent('#qualified-name');

    displayName.renderer = (root: any, grid: any, rowData: any) => {
      root.innerHTML = `<a href="${process.env.REACT_APP_ROOT_PATH}/assets/${rowData.item.guid}/details" target="_blank">${ itemName(rowData.item) }</a>`;
    };

    description.renderer = (root: any, grid: any, rowData: any) => {
      root.textContent = itemDescription(rowData.item);
    };

    qualifiedName.renderer = (root: any, grid: any, rowData: any) => {
      ReactDOM.render(<QualifiedName qualified={rowData.item.properties.qualifiedName}/>, root);
    };

    this.setState({isLoading: true});

    types.getAll().then(response => response.json()).then(data => {
      this.setState({
        isLoading: false,
        types: [
          ...data.map((d: any, i: number) => {
            return {
              id: d.name,
              name: d.name
            };
          })
        ]
      }, () => {
        this.readQueryParams();
        console.log(this.state);
      });
    });
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    const combobox: any = getComponent('#types');
    combobox.items = this.state.types;
    combobox.selectedItems = this.state.selectedTypes.map((d: any, i: number) => {
      return {
        id: d,
        name: d
      };
    });

    const search: any = getComponent('#user-search');
    search.value = this.state.q;

    const exactMatch: any = getComponent('#exact-match');
    exactMatch.checked = this.state.exactMatch;

    const caseSensitive: any = getComponent('#case-sensitive');
    caseSensitive.checked = this.state.caseSensitive;
  }

  readQueryParams() {
    const { location } = this.props;
    const { search } = location;
    let newState = {};

    search.replace('?', '').split('&').forEach((e: any) => {
      const data: Array<any> = e.split('=');
      const prop = data[0];
      const value = data[1];

      switch(prop) {
        case 'q':
          newState = {
            ...newState,
            q: value
          };
          break;
        case 'selectedTypes':
          newState = {
            ...newState,
            selectedTypes: value.split(',')
          };
          break;
        case 'exactMatch':
          newState = {
            ...newState,
            exactMatch: value === 'true' ? true : false
          };
          break;
        case 'caseSensitive':
          newState = {
            ...newState,
            caseSensitive: value === 'true' ? true : false
          };
          break;
        case 'pageSize':
          newState = {
            ...newState,
            pageSize: value
          };
          break;
        default:
          console.log('NOT_FOUND');
      }
    });

    this.setState({
      ...newState
    }, () => {
      this.submit();
    });
  }

  renderBreadcrumb() {
    return(
      <bx-breadcrumb role="nav">
        <bx-breadcrumb-item role="listitem">
          <bx-breadcrumb-link href={process.env.REACT_APP_ROOT_PATH}>Home</bx-breadcrumb-link>
        </bx-breadcrumb-item>

        <bx-breadcrumb-item role="listitem">
          <bx-breadcrumb>Assets</bx-breadcrumb>
        </bx-breadcrumb-item>

        <bx-breadcrumb-item role="listitem">
          <bx-breadcrumb-link href={`${process.env.REACT_APP_ROOT_PATH}/assets/catalog`} size="">Catalog</bx-breadcrumb-link>
        </bx-breadcrumb-item>
      </bx-breadcrumb>
    );
  }

  render() {
    const { data, q, isLoading } = this.state;

    return (
      <div className={`flex-column${ isLoading ? ' is-loading' : ''}`}>
        { this.renderBreadcrumb() }

        <div className="content flex row">
          <div className="m5 row">
            <multiselect-combo-box id="types"
                                   placeholder="Select one or more"
                                   label="Types"
                                   item-id-path="id"
                                   item-value-path="id"
                                   item-label-path="name"
                                   onChange={ () => alert('da') }></multiselect-combo-box>
          </div>

          <div className="m5">
            <vaadin-text-field id="user-search" label="Search" value={q}></vaadin-text-field>
          </div>

          <div className="m5" style={{paddingTop: 32}}>
            <vaadin-checkbox id="exact-match" label="Exact match"></vaadin-checkbox>
          </div>

          <div className="m5" style={{paddingTop: 32}}>
            <vaadin-checkbox id="case-sensitive" label="Case sensitive"></vaadin-checkbox>
          </div>

          <div className="m5" style={{paddingTop: 32}}>
            <vaadin-button id="submit" onClick={ () => this.submit() }>Submit</vaadin-button>
          </div>
        </div>

        <div className="content flex row flex-1">
          <vaadin-grid items={ JSON.stringify(data) } class="full-height">
            <vaadin-grid-sort-column id="display-name" path="properties.displayName" header="Name"></vaadin-grid-sort-column>
            <vaadin-grid-sort-column id="origin" path="origin.metadataCollectionName" header="Origin"></vaadin-grid-sort-column>
            <vaadin-grid-sort-column id="type" path="type.name" header="Type"></vaadin-grid-sort-column>
            <vaadin-grid-sort-column id="qualified-name" path="properties.qualifiedName" header="Context Info"></vaadin-grid-sort-column>
            <vaadin-grid-sort-column id="description" path="properties.summary" header="Description"></vaadin-grid-sort-column>
          </vaadin-grid>
        </div>
        <div className="content flex row">
          <div className="m5">
            <vaadin-button id="load-more" onClick={ () => this.loadMore() }>Load more</vaadin-button>
          </div>
        </div>
      </div>
    );
  }
}

export default AssetCatalog;