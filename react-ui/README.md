# egeria-ui

## Prerequisites
- node v16.13.0 (LTS)

## Available Scripts

### `npm run start`

#### `npm run start --api-url=http://localhost:9000`

This command will start the development server and all API calls are prefixed with the given API_URL parameter.

This works with `odpi/egeria-api-mocks` project started under port 9000 with `npm run start:dev` or an API that
has the CORS feature on.
