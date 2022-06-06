import {authHeader, authHeaderWithContentType} from './auth-header';
import { handleResponse } from './handle-response';

/**
 *
 * Custom fetch implementation that is used cross application for all HTTP
 * requests.
 *
 * @since      0.1.0
 * @access     public
 *
 * @param {string}   var    API endpoint value.
 * @param {object}   [var]  Object with custom options for the request.
 *
 *
 * @return {Promise} Returns request promise to be handled separately per case.
 *
 */
const egeriaFetch = (endpoint: string, method : string, headers : any, options: any) => {
  const requestOptions: any = {
    method: method,
    headers: headers,
    ...options
  };

  const apiUrl = process.env.REACT_APP_API_URL || '';

  return fetch(`${apiUrl}${endpoint}`, requestOptions).then(handleResponse);
}

export {
  egeriaFetch
};