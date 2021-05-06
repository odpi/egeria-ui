import { getCookie } from './local-storage';
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
  ).finally(() => {
    spinner(false);
  });
};