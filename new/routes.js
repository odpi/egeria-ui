export const routes = [
  {
    name: 'root',
    path: '/'
  },
  {
    name: 'login',
    path: '/login',
  },
  {
    name: 'asset-catalog',
    path: '/asset-catalog',
  },
  {
    name: 'asset-lineage',
    path: '/asset-lineage',
  },
  {
    name: 'glossary',
    path: '/glossary',
  },
  {
    name: 'type-explorer',
    path: '/type-explorer'
  },
  {
    name: 'repository-explorer',
    path: '/repository-explorer'
  },
  {
    name: 'about',
    path: '/about'
  }
];

export const routeCheck = (route) => {
  let routeArray = route.split('/');

  if(routeArray.length > 0) {
    return routes.map(r => r.path).includes(`/${routeArray[0]}`);
  }

  if(routeArray.length === 0) {
    return true;
  }
};
