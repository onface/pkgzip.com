# pkgzip

Bundles your npm packages via webpack into a single JS file. Runs on AWS Lambda.

## Usage

```html
<script src="https://pkgzip.com/bundle.js?packages=react,react-dom"></script>

<!--
semver ranges:
https://pkgzip.com/bundle.js?packages=left-pad@^1.1.3,right-pad@1.x

minification:
https://pkgzip.com/bundle.js?packages=left-pad&flags=minify

deduping:
https://pkgzip.com/bundle.js?packages=left-pad,right-pad&flags=dedupe
-->
```

## API

The following URL parameters are accepted:

### `packages`

A required comma-separated list of public npm package names.

Each package name can optionally be suffixed with `@version`, where `version` is any [semver](http://semver.org)-compliant version range.

### `flags`

A optional comma-separated list of values from the following options:

*  `minify`: enables minification of returned JavaScript
*  `dedupe`: enabled de-duplication of modules used more than once

## Development

To get started simply yarn install

```bash
git clone git@bitbucket.org:atlassian/pkgzip.git
yarn install # if you need yarn: npm install -g yarn
```

To run a `pkgzip` server locally you can use

```bash
npm run offline
# now go to http://localhost:3000/dev/bundle.js?packages=left-pad
```

### Tests

Tests are automatically run in CI.

#### Unit tests

To run tests locally use

```
npm run test
```

To have the code automatically be re-tested whenever you modify a file, use `npm run test/watch`

#### Integration tests

Some end to end tests are provided to make sure expected output is returned from relevant endpoints.

Integration tests are run automatically in CI, but if you want you can run them locally too using

```
npm run integration-test
```

## Deploying to Lambda

Changes to `master` are automatically tested and deployed to Lambda via [Bamboo](https://ecosystem-bamboo.internal.atlassian.com/browse/AUI-DMS).

AWS Lambda has some environment restrictions (e.g. old version of Node JS), so a Docker image is used to rebuild the app (including node modules) and then deploy to Lambda.

![Morty](https://i.imgur.com/BQoEXts.png)
