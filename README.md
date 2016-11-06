# morty

Bundles your npm packages via webpack into a single JS file. Runs on AWS lambda.

### Usage

```html
<script src="https://eovrzrbij2.execute-api.ap-southeast-2.amazonaws.com/dev/bundle.js?packages=ak-navigation@latest,ak-icon@8.x&flags=minify,dedupe"></script>
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

To get started simply npm install

```
npm install
```

And build Morty

```
npm run dist
```

To run a Morty server locally you can use

```
npm run offline
```

You will now be able to reach your local server from

```
localhost:3000/bundle.js?packages=ak-avatar
```

### Tests

Tests are automatically run in CI. To run them locally use

```
npm run test
```

or

```
npm run test/watch
```

To have the code automatically be rebuilt and tested.

### Deploying to Lambda

Changes to `master` are automatically tested and deployed via Bamboo.

![Morty](https://bitbucket.org/repo/qbqoG9/images/3560229856-Screen%20Shot%202016-10-21%20at%2011.00.02%20am.png)
