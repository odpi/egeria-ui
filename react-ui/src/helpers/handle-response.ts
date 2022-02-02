import { authenticationService } from '../services/authentication.service';

export function handleResponse(response: any) {
    if (!response.ok) {
        if ([401, 403].indexOf(response.status) !== -1) {
            // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
            authenticationService.logout();
        }

        return Promise.reject();
    }

    return response;
}
