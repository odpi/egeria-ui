import { BehaviorSubject } from 'rxjs';
import { handleResponse } from '../helpers/handle-response';

const currentUserSubject = new BehaviorSubject(parseJwt(localStorage.getItem('currentJwt') || ""));

export const authenticationService = {
    login,
    logout,
    parseJwt,
    currentJwt: () => localStorage.getItem('currentJwt'),
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};

function parseJwt (token: string) {
    if(token !== "") {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }
};

function login(username: string, password: string) {
    const requestOptions = {
        method: 'POST',
        body: new URLSearchParams(`username=${username}&password=${password}`)
    };

    return fetch(`/api/auth/login`, requestOptions)
        .then(handleResponse)
        .then(response => {
            const token = response.headers.get('x-auth-token');

            localStorage.setItem('currentJwt', token);

            currentUserSubject.next(parseJwt(token));

            return token;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentJwt');

    currentUserSubject.next(null);

    console.log('logged out');

    window.location.href = "/react-ui";
}
