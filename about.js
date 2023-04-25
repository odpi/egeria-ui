const fs = require('fs');
const packageJson = require('./package.json');
let revision = '';

try {
  revision = require('child_process')
                  .execSync('git rev-parse HEAD')
                  .toString().trim();
} catch(e) {
  revision = 'Revision not found';
}

let about = {
  name: packageJson.name,
  version: packageJson.version,
  commitId: revision,
  buildTime: Date(Date.now())
};

let data = JSON.stringify(about);

fs.writeFile(`./build/about.json`, data, function(err) {
  if(err) {
    console.log(err);
  } else {
    console.log('The file about.js was created!');
  }
});