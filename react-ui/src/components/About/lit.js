import { LitElement, html } from 'lit';
import { customElementsRegister } from '../../helpers/custom-elements-register';
import { egeriaFetch } from '../../helpers/egeria-fetch';

/**
 *
 * LitElement component used for displaying details about the application instance.
 *
 * @since      0.1.0
 * @access     public
 *
 */
class AboutLit extends LitElement {
  static get properties() {
    return {
      data: {}
    };
  }

  connectedCallback() {
    super.connectedCallback()
    console.log('connected');

    egeriaFetch('/about.json', {})
      .then((data) => {
        return data.json()
      })
      .then((data) => {
        this.data = data;

        console.log(data);
      });
  }

  render() {
    return html`
      <div>
        <style>
          tr:nth-child(odd) > td {
            font-weight: bold;
            padding-top:var(--padding-top);
          }

          tr:nth-child(even) > td {
            color: var(--custom-gray);
          }
        </style>

        <h1>About Lit</h1>
        <table class="table">
          <thead></thead>
          <tbody>
            <tr>
              <td>Application Name</td>
            </tr>
            <tr>
              <td>${ this.data ? this.data.name : '' }</td>
            </tr>
            <tr>
              <td>Version</td>
            </tr>
            <tr>
              <td>${ this.data ? this.data.version : '' }</td>
            </tr>
            <tr>
              <td>CommitId</td>
            </tr>
            <tr>
              <td>${ this.data ? this.data.commitId : '' }</td>
            </tr>
            <tr>
              <td>Build time</td>
            </tr>
            <tr>
              <td>${ this.data ? this.data.buildTime : '' }</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }
}

customElementsRegister('egeria-about-lit', AboutLit);