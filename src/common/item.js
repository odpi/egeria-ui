/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */
import {ItemUtilsBehavior} from './item-utils';

export const ItemViewBehaviorImpl = {

  properties: {
    item: Object
  },
  observers: ['_itemChanged(item)'],

  _itemChanged(item) {
    console.debug('details items changed');

    if (item) {
      this._pushCrumb(this._itemName(item), '/#/asset-catalog/view/'+item.guid);

      if(this.routeData && this.routeData.usecase) {
        this._pushCrumb( this.usecases[this.routeData.usecase],null);
      }

      this._attributes(item);

    } else {
      window.dispatchEvent(new CustomEvent('show-feedback', {
        bubbles: true,
        composed: true,
        detail: { message: "Item not found!", level: 'error' }
      }));
    }


  },

  _usecaseIndex(usecase) {
    return Object.keys(this.usecases).indexOf(usecase);
  },

  _pushCrumb(val, href) {
    this.dispatchEvent(new CustomEvent('push-crumb', {
      bubbles: true,
      composed: true,
      detail: { label: val, href: href }
    }));
  },

  _itemName(item) {
    if (item.properties.displayName && item.properties.displayName != null)
      return item.properties.displayName;
    else if (item.properties.name && item.properties.name != null)
      return item.properties.name;
    else
      return 'N/A';
  },

}

export const ItemViewBehavior = [ ItemUtilsBehavior, ItemViewBehaviorImpl ]