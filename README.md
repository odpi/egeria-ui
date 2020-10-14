# Table of contents
1. [Prerequisites](#prerequisites)
2. [Install dependencies](#install-dependencies)
3. [Run Tests](#run-tests)
4. [Development start](#development-start)
    1. [Mocked API Method](#mocked-api-method)
        1. [UI](#ui)
        2. [Mocked API](#mocked-api)
    2. [Local API Method](#local-api-method)
        1. [UI](#ui-1)
        2. [API](#api)
    3. [Production Method](#production-method)
        1. [UI](#ui-2)
        2. [API](#api-2)
5. [Release cycle](#release-cycle)
6. [Using egeria-ui as a dependency](#using-egeria-ui-as-a-dependency)
7. [Links](#links)

## Prerequisites
|         |   Version  |
|---------|------------|
| NodeJS  |     8.x    |
| NPM     |     5.x    |

Usually NPM version that works comes with the NODEJS dependency.


## Install dependencies
```bash
$ npm install
```

## Run tests
```bash
$ npm test
```

## Development start

### Mocked API method

#### UI
```bash
$ git clone https://github.com/odpi/egeria-ui
$ cd egeria-ui
$ npm install
$ npm run serve # will start a static server on http://localhost:8080 and will proxy any missing
                # API Endpoints to the Mocked API
```

#### Mocked API
```bash
$ git clone https://github.com/odpi/egeria-api-mocks
$ cd egeria-api-mocks
$ npm install
$ npm start # will start a Mocked API on http://localhost:9000
```

### Local API method
#### UI
```bash
$ git clone https://github.com/odpi/egeria-ui
$ cd egeria-ui
$ npm install
$ npm start # will start a static server on http://localhost:8081, no API endpoint will work if you access this directly.
```

#### API
```bash
$ git clone https://github.com/odpi/egeria
$ cd open-metadata-implementation/user-interfaces/ui-chassis/ui-chassis-spring/
$ mvn spring-boot:run -Dspring-boot.run.folders=/path/to/themes/ -Dspring-boot.run.arguments="--theme=default --zuul.routes.ui.url=http://localhost:8081 --omas.server.name= --omas.server.url= --open.lineage.server.url= --open.lineage.server.name= --server.ssl.trust-store=/path/to/egeria/truststore.p12"
```

### Production method
#### UI
```bash
$ npm install
$ npm test
$ npm run build # will be generating a static folder under ./build/dev
                # folder which needs to be served using static server at a given address (e.g. https://ui.production) ⚠️ Warning.
```

#### API
Build the egeria project [2] and deploy it with all the required ENV variables, also pass `--zuul.routes.ui.url=https://ui.production` as an ENV variable to the `.jar` ⚠️ Warning.


## Release cycle
Egeria-UI use GitHub as its dependency provider, this means that all the releases are being pushed to the Github Egeria-UI repository here [1]. 

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

## Using egeria-ui as a dependency
For any other NPM package who wants to add `egeria-ui@0.0.0` as a dependency it can use the direct URL dependency from GitHub like this:
```json
{
  "name": "your-own-npm-package",
  "dependencies": {
    "egeria-ui": "https://github.com/odpi/egeria-ui#v0.0.0"
  }
}
```
You can also use a branch name or commit ID to point to a version, useful for work in progress or to use lastest merged code in master (e.g. #master, #d12c09a).

## Links
[0] - https://github.com/odpi/egeria/tree/master/open-metadata-implementation/user-interfaces/ui-chassis/ui-chassis-spring/

[1] - https://github.com/odpi/egeria-ui/releases

[2] - https://github.com/odpi/egeria
