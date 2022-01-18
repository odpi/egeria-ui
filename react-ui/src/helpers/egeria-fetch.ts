import { authHeader } from './auth-header';
import { handleResponse } from './handle-response';

const egeriaFetch = (endpoint: string, options: any) => {
  const requestOptions: any = {
    method: 'GET',
    headers: authHeader(),
    ...options
  };

  return fetch(endpoint, requestOptions).then(handleResponse);
}

export {
  egeriaFetch
};