import { getCookie } from './cookies';
import { ENV } from '../../env';

export const egeriaFetch = (url, headers) => {
  return fetch(
    `${ ENV['API_URL'] }${ url }`,
    {
      headers: {
        'content-type': 'application/json',
        'x-auth-token': getCookie('token'),
        ...headers
      }
    }
  );
};