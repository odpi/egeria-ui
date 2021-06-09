/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

export const EgeriaItemUtilsBehavior = {
  _attributes(obj) {
      var arr = [];
      if (obj === undefined) {
          return arr;
      }
      Object.keys(obj).forEach(
          (key) => {
              var value = obj[key];
              if (typeof value !== 'object' && value !== null)
                  arr.push({ 'key': this._camelCaseToSentence(key), 'value': value });
          }
      );
      return arr;
  },

  _fallbackDisplayName(obj) {
      if( this._hasKey(obj, 'properties') && this._hasKey(obj.properties, 'displayName') ) {
          return obj.properties.displayName;
      }
      if( this._hasKey(obj, 'properties') && this._hasKey(obj.properties, 'name') ) {
          return obj.properties.name;
      }
      return obj.guid;

  },

  _hasKeys(obj) {
      return obj !== undefined && obj !== null && Object.keys(obj).length > 0;
  },

  _hasKey(obj, key) {
      return key in obj;
  },

  _itemClassifications(val, key) {
    return this._attributes(val).concat(this._attributes(val[key]));
  },

  _camelCaseToSentence(val) {
      return val
          .replace(/([A-Z])/g, ' $1')
          .replace(/([A-Z]+\s+)/g, c => c.trim())
          .replace(/_/g, ' ') // replace underscores with spaces
          .replace(/^\w/, c => c.toUpperCase()); //uppercase first letter
  }
}
