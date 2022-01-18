
import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response';

export const types = {
    getAll
};

function getAll() {
    const requestOptions: any = { method: 'GET', headers: authHeader() };

    return fetch(`/api/assets/types`, requestOptions).then(handleResponse);
}