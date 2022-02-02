import { authenticationService } from '../services/authentication.service';

export function authHeader() {
    // return authorization header with jwt token
    const currentJwt = authenticationService.currentJwt();

    if (currentJwt) {
        return { "x-auth-token": currentJwt };
    } else {
        return {};
    }
}
