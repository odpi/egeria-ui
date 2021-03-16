# Table of contents

1. [Prerequisites](#prerequisites)
2. [Dependencies](#dependencies)
3. [Tests](#tests)
4. [Development](#development)
5. [Production](#production)
    1. [Standalone build](#tandalone-build)
    1. [Preconfigured build with API_URL parameter](#preconfigured-build-with-api_url-parameter)
6. [Themes](#themes)
7. [Release cycle](#release-cycle)
8. [Links](#links)
9. [License](#license)

## Prerequisites
|         |        Version      |
|---------|---------------------|
| NodeJS  |     10.13.0 (LTS)   |
| NPM     |        6.4.1        |

## Dependencies
```bash
$ npm install
```

## Tests
```bash
$ npm test
```

## Development

### Development with backend API

The backend API URL from odpi/egeria (ui-chassis-spring, here [0]), which needs
to start with CORS filter on.

```bash
$ npm run start --api-url=http://localhost:8443
```

### Development with mocked API

The backend API URL from odpi/egeria-api-mocks (egeria-api-mocks, here [1]).

```bash
$ npm run start --api-url=http://localhost:9000
```

## Production

### Standalone build

Outputs the build in `/build/prod` with no config what so ever.

```bash
$ npm run build
```

### Preconfigured build with API_URL parameter

Outputs the build with all HTTP requests prefixed with the given API_URL parameter.
The API server needs to have the CORS filter on.

```bash
npm run build --api-url=http://api.app.prod
```

## Themes

The theme folder now sits statically under the `themes` folder, changing the files
here will change the theme directly. It is directly referenced in the `index.html` page.

## Release cycle
Egeria-UI use GitHub as its dependency provider, this means that all the releases
are being pushed to the Github Egeria-UI repository here [2].

```bash
$ git clone https://github.com/odpi/egeria-ui     # clone and checkout to master branch
$ vim release-notes.md                            # add release notes
$ git commit -m "Add release notes"
$ npm version patch                               # (minor or major) this will create a new commit with the bumped version
                                                  # and also a git version tag
$ # `npm publish .` won't be executed since we are using GitHub as a direct dependency
$ git push origin master
$ git push origin master --tags
$                                                 # the released version will be available at the git version tag or in the
                                                  # release page here [1]
```

## Links
[0] - https://github.com/odpi/egeria/tree/master/open-metadata-implementation/user-interfaces/ui-chassis/ui-chassis-spring/

[1] - https://github.com/odpi/egeria-api-mocks

[2] - https://github.com/odpi/egeria-ui

## License
SPDX-License-Identifier: Apache-2.0

Copyright Contributors to the ODPi Egeria project.
