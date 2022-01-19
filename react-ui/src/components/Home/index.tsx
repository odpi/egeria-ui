import React from "react";
import { Link } from "react-router-dom";
import './index.scss';

import logoTransparent from '../../static/Logo_transparent.png';
import { egeriaFetch } from "../../helpers/egeria-fetch";

interface Props {
}

interface State {
  titles: any;
  descriptions: any;
}

class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      titles: [],
      descriptions: []
    };
  }

  componentDidMount() {
    this.getAppInfo();
  }

  getAppInfo() {
    egeriaFetch('/api/public/app/info', {}).then(data => {
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
                return (<span className={ `title__part-${i}` }>{t}</span>);
              }) }
            </h1>
          </div>
        </div>

        <div className="content">
          {/* simple search */}
        </div>

        <div className="content">
          <div className="flex space-between">
            { (descriptions.length > 0) && descriptions.map((d: any, i: number) => {
                return (<div className={ `description br5 p15 description-${i}` }>
                  <strong>{ d.title }</strong>
                  <p>{ d.description }</p>
                </div>);
              }) }
          </div>
        </div>

        <div className="content">
          <div className="footer row">
            <p>Powered by</p>
            <img src={ logoTransparent }/>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;