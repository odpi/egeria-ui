const getComponent = (id: string) => {
  return document.querySelector(id);
};

const arrayIntersect = (array1: any, array2: any) => {
  return array1.filter((value: any) => array2.includes(value));
};

const updateQueryParam = (param: any, value: any) => {
  if ('URLSearchParams' in window) {
    var searchParams = new URLSearchParams(window.location.search)
    searchParams.set(param, value);

    var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();

    window.history.pushState(null, '', newRelativePathQuery);
  }
}

function capitalize(s: string){
  return s && s[0].toUpperCase() + s.slice(1);
}

export {
  capitalize,
  getComponent,
  arrayIntersect,
  updateQueryParam
}