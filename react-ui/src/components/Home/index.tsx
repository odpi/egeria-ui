import React from "react";
import { Link } from "react-router-dom";
import './index.scss';

import logoTransparent from '../../static/Logo_transparent.png';
import { egeriaFetch } from "../../helpers/egeria-fetch";

import 'multiselect-combo-box/multiselect-combo-box.js';
import { types } from '../../services/user.service';
// import '@vaadin/vaadin-text-field';
import {authHeader} from "../../helpers/auth-header";

interface Props {
}

interface State {
  titles: any;
  descriptions: any;
}

/**
 *
 * React component used for displaying the Home page.
 *
 * @since      0.1.0
 * @access     public
 *
 */
class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      titles: [],
      descriptions: []
    };
  }

  getCombobox() {
    return document.querySelector('#types');
  }

  getSearch() {
    return document.querySelector('#user-search');
  }

  componentDidMount() {
    this.getAppInfo();

    types.getAll().then(response => response.json()).then(data => {
      const combobox: any = this.getCombobox();

      combobox.items =  data.map((d: any, i: number) => {
        return {
          id: d.name,
          name: d.name
        };
      });
    })
  }

  submit() {
    const combobox: any = this.getCombobox();
    const search: any = this.getSearch();

    const selectedItems = combobox.selectedItems || [];
    const searchValue = search.value || '';

    let queryParams = `?q=${searchValue}`;

    if(selectedItems.length > 0) {
      queryParams = `${queryParams}&selectedTypes=${selectedItems.map((i: any) => i.id).join(',')}`;
    }

    window.location.href = `${process.env.REACT_APP_ROOT_PATH}/assets/catalog${ queryParams }`;
  }

  getAppInfo() {
    egeriaFetch('/api/public/app/info', 'GET', authHeader(), {}).then(data => {
      return data.json();
    }).then(data => {
      this.setState({
        titles: !['', undefined].includes(data.title) ? data.title.split('|') : [],
        descriptions: !['', undefined].includes(data.description) ? data.description.split('@@').map((d: any) => {
          let [ title, description ] = d.split('||');

          return {
            title: title,
            description: description
          }
        }) : []
      });
    });
  }

  render() {
    const { titles, descriptions } = this.state;

    return (
      <div className="home">
        <div className="content">
          <div className="menu">
            <ul className="br5">
              <li>
                <Link to={`/`}>Home</Link>
              </li>
              <li>
                <Link to={`/assets/catalog`}>Catalog</Link>
              </li>
              <li>
                <Link to={`/lineage/viewer`}>Viewer</Link>
              </li>
              <li className="pull-right">
                <Link to={`/about`}>About</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="content">
          <div className="header br5">
            <h1>
              { (titles.length > 0) && titles.map((t: any, i: number) => {
                return (<span className={ `title__part-${i}` } key={i}>{t}</span>);
              }) }
            </h1>
          </div>
        </div>

        <div className="content flex row">
          <div className="m5">
            <multiselect-combo-box id="types"
                                   placeholder="Select one or more"
                                   label="Types"
                                   item-id-path="id"
                                   item-value-path="id"
                                   item-label-path="name"></multiselect-combo-box>
          </div>

          <div className="m5">
            <vaadin-text-field id="user-search" label="Search"></vaadin-text-field>
          </div>

          <div className="m5" style={{paddingTop: 32}}>
            <vaadin-button id="submit" onClick={ () => this.submit() }>Submit</vaadin-button>
          </div>
        </div>

        <div className="content">
          <div className="flex space-between">
            { (descriptions.length > 0) && descriptions.map((d: any, i: number) => {
                return (<div className={ `description br5 p15 description-${i}` } key={i}>
                  <strong>{ d.title }</strong>
                  <p>{ d.description }</p>
                </div>);
              }) }
          </div>
        </div>

        <div className="content">
          <div className="footer row">
            <p>Powered by</p>
            <img src={ logoTransparent } alt="logo"/>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;