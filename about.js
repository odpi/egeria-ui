const fs = require('fs');
const packageJson = require('./package.json');
const polymerJson = require('./polymer.json');

let about = {
  name: packageJson.name,
  version: packageJson.version,
  commitId: null,
  buildTime: new Date.now().getTime()
};

let data = JSON.stringify(about);

fs.writeFileSync(`./build/${polymerJson.builds[0].name}/about.json`, data);