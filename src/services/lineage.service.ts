import {authHeader} from '../helpers/auth-header';
import {handleResponse} from '../helpers/handle-response';

export const lineage = {
    getLineageTypes,
    getNameSuggestions
};

/**
 *
 * HTTP API request for retrieving all the lineage types.
 *
 * @access     public
 *
 *
 * @return {Promise} Returns a promise with the request.
 *
 */
function getLineageTypes() {
    const requestOptions: any = {method: 'GET', headers: authHeader()};

    return fetch(`/api/lineage/types`, requestOptions).then(handleResponse);
}

/**
 *
 * HTTP API request for retrieving names suggestions based on input
 *
 * @access     public
 *
 *
 * @return {Promise} Returns a promise with the request.
 *
 */
function getNameSuggestions(name: string, type: string) {
    const requestOptions: any = {method: 'GET', headers: authHeader()};
    let url = `/api/lineage/nodes`;
    if (type) {
        url = `${url}?type=${type.trim()}`;
        if (name) {
            url = `${url}&name=${name.trim()}`;
        }
        url = `${url}&limit=10`;
    }

    return fetch(url, requestOptions).then(handleResponse);
}