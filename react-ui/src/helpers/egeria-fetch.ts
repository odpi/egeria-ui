import { authHeader } from './auth-header';

const egeriaFetch = (endpoint: string, options: any) => {
  const requestOptions: any = {
    method: 'GET',
    headers: authHeader(),
    ...options
  };

  return fetch(endpoint, requestOptions);
}

export {
  egeriaFetch
};