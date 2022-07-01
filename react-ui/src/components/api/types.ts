import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/handle-response';

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

    return fetch(`/api/assets/types`, requestOptions).then(handleResponse);
}