export const setCookie = (name, value) => {
  window.localStorage.setItem(name, value);
};

export const getCookie = (name) => {
  return window.localStorage.getItem(name);
};

export const removeCookie = (name) => {
  localStorage.removeItem(name);
};