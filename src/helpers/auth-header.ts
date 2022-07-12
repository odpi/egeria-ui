import { authenticationService } from '../services/authentication.service';

/**
 *
 * Header key and value used for authenticating HTTP requests
 * retrieved from the localStorage.
 *
 * @since      0.1.0
 * @access     public
 *
 *
 * @return {object} Returns authorization header with JWT token
 * object with key and value.
 *
 */
export function authHeader() {
    const currentJwt = authenticationService.currentJwt();

    if (currentJwt) {
        return { "x-auth-token": currentJwt };
    } else {
        return {};
    }
}

export function authHeaderWithContentType() {
    const currentJwt = authenticationService.currentJwt();

    if (currentJwt) {
        return {
            "x-auth-token": currentJwt,
            "Content-Type": "application/json",
            "accept" : "application/json"
        };
    } else {
        return {};
    }
}
