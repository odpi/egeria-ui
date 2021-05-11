/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

export const RoleComponentsBehavior = {
  _hasComponent(components, component) {
    return components.includes("*") || components.includes(component);
  }
}
