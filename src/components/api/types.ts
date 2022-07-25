import { apiUrl } from '.';
import { authHeader, handleResponse } from 'egeria-ui-core';

export const types = {
  getAll
};

/**
 *
 * HTTP API request for retrieving all the asset types.
 *
 * @since      0.1.0
 * @access     public
 *
 *
 * @return {Promise} Returns a promise with the request.
 *
 */
function getAll() {
    const requestOptions: any = { method: 'GET', headers: authHeader() };

    return fetch(`${apiUrl()}/api/assets/types`, requestOptions).then(handleResponse);
}