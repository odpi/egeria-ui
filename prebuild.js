const fs = require('fs');
let apiUrl = process.env.npm_config_api_url || '';
let production = process.env.npm_config_production || false;
let requestTimeout = process.env.npm_config_request_timeout || 30000;

if(apiUrl === '/' || apiUrl === null || apiUrl === undefined) {
  apiUrl = '';
}

let data = `export const ENV = {
  'API_URL': '${ apiUrl }',
  'ROOT_PATH': '/',
  'PRODUCTION': ${ production },
  'REQUEST_TIMEOUT': ${ requestTimeout }
}
`;

fs.writeFile('env.js', data, function(error) {
    if(error) {
      return console.log(error);
    }

    console.log('The file env.js was created!');
});
