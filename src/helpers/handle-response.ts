import { authenticationService } from '../services/authentication.service';

/**
 *
 * Handles any HTTP promise and checks if response is authorized or not. It
 * auto logs out if 401 Unauthorized or 403 Forbidden response was returned
 * from the API.
 *
 * @since      0.1.0
 * @access     public
 *
 * @param {Promise}   var   Promise of a HTTP request.
 *
 * @return {Promise} Returns the handled promise.
 *
 */
export function handleResponse(response: any) {
    if (!response.ok) {
        if ([401, 403].indexOf(response.status) !== -1) {
            authenticationService.logout();
        }

        return Promise.reject();
    }

    return response;
}
