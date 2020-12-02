/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

export const RoleComponentsBehavior = {
  properties: {
    components: {
      type: Array,
      value: null
    }
  },

  observers: ['_componentsChanged(components)'],

  _componentsChanged(components) {
    console.debug('components list changed');
  },

  _hasComponent(comp) {
    return this.components.length === 0 || this.components.includes(comp);
  }
}
