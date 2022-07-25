import {
  authHeader,
  handleResponse
} from 'egeria-ui-core';
import { apiUrl } from '.';

function getLineageTypes() {
  const requestOptions: any = {method: 'GET', headers: authHeader()};

  return fetch(`${apiUrl()}/api/lineage/types`, requestOptions).then(handleResponse);
}

function getNameSuggestions(name: string, type: string) {
  const requestOptions: any = {method: 'GET', headers: authHeader()};

  let url = `${apiUrl()}/api/lineage/nodes`;

  if (type) {
    url = `${url}?type=${type.trim()}`;
    if (name) {
      url = `${url}&name=${name.trim()}`;
    }
    url = `${url}&limit=10`;
  }

  return fetch(url, requestOptions).then(handleResponse);
}

export const lineage = {
  getLineageTypes,
  getNameSuggestions
};