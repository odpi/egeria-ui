import { BehaviorSubject } from 'rxjs';

const currentUserSubject = new BehaviorSubject(parseJwt(localStorage.getItem('currentJwt') || ""));

export const authenticationService = {
  login,
  logout,
  parseJwt,
  currentJwt: () => localStorage.getItem('currentJwt'),
  currentUser: currentUserSubject.asObservable(),
  get currentUserValue () { return currentUserSubject.value }
};

/**
*
* Parses a JWT token string.
*
* @since      0.1.0
* @access     public
*
* @param {string}   var    JWT Token.
*
* @return {Object} Returns pased JWT Token object.
*
*/
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

/**
*
* Handles login by setting the JWT Token on localStorage.
*
* @since      0.1.0
* @access     public
*
* @param {string}   var    Username
* @param {string}   var    Password
*
* @return {Promise} Returns a promise with the request.
*
*/
function login(username: string, password: string) {
  const requestOptions = {
    method: 'POST',
    body: new URLSearchParams(`username=${username}&password=${password}`)
  };

  return fetch(`/api/auth/login`, requestOptions)
    .then((response) => {
      if(response.ok) {
        const token = response.headers.get('x-auth-token');

        setToken(token);
      }

      return response;
    });
}

/**
*
* Sets the token to localStorage
*
* @since      0.1.0
* @access     public
*
* @return {void} Returns nothing.
*
*/
function setToken(token: any) {
  const _token = token || '';

  localStorage.setItem('currentJwt', _token);

  currentUserSubject.next(parseJwt(_token));
}

/**
*
* Handles logout by removing the JWT Token from localStorage.
*
* @since      0.1.0
* @access     public
*
* @return {void} Returns undefined and redirects to given path.
*
*/
function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('currentJwt');

  currentUserSubject.next(null);

  console.log('logged out');

  window.location.href = `${process.env.REACT_APP_ROOT_PATH}`;
}
