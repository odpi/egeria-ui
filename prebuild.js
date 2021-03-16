const fs = require('fs');
let apiUrl = process.env.npm_config_api_url || '';

if(apiUrl === '/' || apiUrl === null || apiUrl === undefined) {
  apiUrl = '';
};

let data = `export const ENV = {
  'API_URL': '${ apiUrl }',
  'ROOT_PATH': '/'
}
`;

fs.writeFile('env.js', data, function(error) {
    if(error) {
      return console.log(error);
    }

    console.log('The file env.js was created!');
});
