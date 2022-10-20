const fs = require('fs');
const packageJson = require('./package.json');
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

fs.writeFile(`./build/about.json`, data, function(err) {
  console.log('The file about.js was created!');
});