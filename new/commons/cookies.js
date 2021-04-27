export const setCookie = (name, value) => {
  document.cookie = `${name}=${value}`;
};

export const getCookie = (name) => {
  if(document.cookie === '') {
    return null;
  }

  let kv = document.cookie.split('=');

  let data = {
    [kv[0]]: kv[1]
  };

  return data[name];
}

export const eraseCookies = () => {
  document.cookie = '';
}