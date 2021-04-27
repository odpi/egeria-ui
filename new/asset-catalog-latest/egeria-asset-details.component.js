/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */
import { PolymerElement, html } from '@polymer/polymer';

class EgeriaAssetDetails extends PolymerElement {
  static get properties() {
    return {
      guid: { type: String, value: '' }
    }
  }

  atob(string) {
    return window.atob(string);
  }

  static get template() {
    return html`
      Asset details

      guid: [[ atob(guid) ]]





    `;
  }
}

window.customElements.define('egeria-asset-details', EgeriaAssetDetails);
