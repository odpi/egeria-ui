/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

export const RoleComponentsBehavior = {

        properties: { components: Array},

        observers:[ '_componentsChanged(components)' ],

        _componentsChanged(components) {
            console.debug('components list changed');
        }

}