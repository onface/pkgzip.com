# pkgzip

Bundles your npm packages via webpack into a single JS file. Runs on AWS lambda.

### Usage

```html
<script src="https://pkgzip.com/bundle.js?packages=ak-navigation@latest,ak-icon@8.x&flags=minify,dedupe"></script>
```

### API

Package versions can be specified with the common [semver](http://semver.org) formats:

-  Fixed versions - `ak-navigation@11.2.1`
-  .x versions - `ak-navigation@11.x`
-  Caret versions - `ak-navigation@^11.2.1`
-  Tilde versions - `ak-navigation@~11.2.1`
-  ..as well as `<1.x <=1.x >=1.x >1.x`

### Compression and caching

By default results are unminified. The `flags=minify` or `flags=minify,dedupe` parameter can be to trigger minification + deduplication.

After your request has been expanded (e.g. `ak-navigation@11.x ==> ak-navigation@11.2.1`), the result is cached indefinitely to S3 for faster results next time. Results are GZIP encoded during transfer to the browser.

### Development

To get started simply yarn install

```bash
npm install -g yarn
yarn install
```

To run a `pkgzip` server locally you can use

```bash
npm run offline

# now go to http://localhost:3000/dev/bundle.js?packages=ak-avatar
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

### Deploying to Lambda

Changes to `master` are automatically tested and deployed via [Bamboo](https://ecosystem-bamboo.internal.atlassian.com/browse/AUI-DMS).

![Morty](https://bitbucket.org/atlassian/morty/avatar/48/)
