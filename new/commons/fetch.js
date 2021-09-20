import { getCookie, setCookie, removeCookie } from './local-storage';
import { ENV } from '../../env';

let spinnerCount = 0;

const spinner = (flag) => {
  if(flag) {
    spinnerCount++;
  } else {
    spinnerCount--;
  }

  let value = flag ? 'open' : 'close';

  let evt = new CustomEvent(`egeria-${ value }-spinner`, {
    detail: {},
    bubbles: true,
    composed: true
  });

  if(value === 'open' && spinnerCount >= 0) {
    window.dispatchEvent(evt);
  }

  if(value === 'close' && spinnerCount === 0) {
    window.dispatchEvent(evt);
  }
};

export const egeriaFetch = (url, headers) => {
  spinner(true);

  return fetch(
    `${ ENV['API_URL'] }${ url }`,
    {
      headers: {
        'content-type': 'application/json',
        'x-auth-token': getCookie('token'),
        ...headers
      }
    }
  )
  .then((response) => {
    if(response.status === 403 && !['/login'].includes(window.location.pathname)) {
      removeCookie('token');
      setCookie('token', '');

      window.location.href = '/login';
    }

    if(response.status === 404) {
      let event = new CustomEvent("egeria-throw-message", { "detail": '404 Not Found' });

      window.dispatchEvent(event);
    }

    if(response.status === 500) {
      let event = new CustomEvent("egeria-throw-message", { "detail": '500 Internal Server Error' });

      window.dispatchEvent(event);
    }

    return response.text();
  })
  .then(data => {
    // adding this temporarily because /logout retrieves no content and
    // response.json() fails to parse empty content as JSON
    return data ? JSON.parse(data) : null;
  })
  .catch(function(e) {
    let event = new CustomEvent("egeria-throw-message", { "detail": e });

    window.dispatchEvent(event);

    return {};
  })
  .finally(() => {
    spinner(false);
  });
};