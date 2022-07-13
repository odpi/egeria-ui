import { apiUrl } from '.';
import { authHeader, handleResponse } from 'egeria-ui-core';

export const glossaries = {
  getAll,
  getGlossaryCategories,
  getGlossaryTerms
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

    return fetch(`${apiUrl()}/api/glossaries`, requestOptions).then(handleResponse);
}

/**
 *
 * HTTP API request for retrieving all the glossary categories.
 *
 * @since      0.1.0
 * @access     public
 *
 *
 * @return {Promise} Returns a promise with the request.
 *
 */
function getGlossaryCategories() {
  const requestOptions: any = { method: 'GET', headers: authHeader() };

  return fetch(`${apiUrl()}/api/glossaries/categories`, requestOptions).then(handleResponse);
}

/**
 *
 * HTTP API request for retrieving all the glossary terms.
 *
 * @since      0.1.0
 * @access     public
 *
 *
 * @return {Promise} Returns a promise with the request.
 *
 */
 function getGlossaryTerms() {
  const requestOptions: any = { method: 'GET', headers: authHeader() };

  return fetch(`${apiUrl()}/api/glossaries/terms`, requestOptions).then(handleResponse);
}
