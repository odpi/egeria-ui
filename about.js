const fs = require('fs');
const packageJson = require('./package.json');
const polymerJson = require('./polymer.json');
const revision = require('child_process')
                  .execSync('git rev-parse HEAD')
                  .toString().trim();

let about = {
  name: packageJson.name,
  version: packageJson.version,
  commitId: revision,
  buildTime: Date(Date.now())
};

let data = JSON.stringify(about);

fs.writeFile(`./build/${polymerJson.builds[0].name}/about.json`, data, function(err) {
  console.log('The file about.js was created!');
});