# pkgzip

Bundles your npm packages via webpack into a single JS file. Runs on AWS Lambda.

## Usage

```html
<script src="https://pkgzip.com/?react,react-dom"></script>

<!--
semver ranges:
https://pkgzip.com/?react@^15.4.0,left-pad@1.x

minification:
https://pkgzip.com/?react&flags=minify

deduping:
https://pkgzip.com/?react,left-pad&flags=dedupe
-->
```

## API

The following URL parameters are accepted:

### `packages`

A required comma-separated list of public npm package names.

Each package name can optionally be suffixed with `@version`, where `version` is any [semver](http://semver.org)-compliant version range.

### `flags`

A optional comma-separated list of values from the following options:

*   `minify`: enables minification of returned JavaScript
*   `dedupe`: enabled de-duplication of modules used more than once

## Development

To get started simply yarn install

```bash
git clone git@bitbucket.org:atlassian/pkgzip.git
yarn install # if you need yarn: npm install -g yarn
```

To run a `pkgzip` server locally you can use

```bash
npm run offline
# now go to http://localhost:3000/dev/?react
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

Changes to `master` are automatically tested and deployed to Lambda via [Bitbucket Pipelines](https://bitbucket.org/atlassian/pkgzip/addon/pipelines/home).

### SSL Certificate

The production domain uses an SSL certificate provided by Let's Encrypt.

To provision use the following steps (similar to [this blog post](http://blog.brianz.bz/post/custom-https-domains-with-serverless/)):

0.  Log in to http://go.atlassian.com/aws
0.  Select `design-platform-team`
0.  Navigation to S3 and prepare to upload a new verison of `pkgzip-letsencrypt-nonce/challenge.txt`
0.  In a new local folder run `certbot certonly -a manual --config-dir . --logs-dir . --work-dir .`
0.  Upload the blob shown to `pkgzip-letsencrypt-nonce/challenge.txt` on S3 (set read access form everyone)
0.  Repeat if challenge fails (usually due to timeout/expiry)
0.  Upload cert to AWS Certificate Manager, noting the generated ARN (must be `us-east-1` region)
0.  Set uploaded certificate name tag to `pkgzip-letsencrypt-YYYYMMDD`
0.  Delete local certificate files
0.  Go to API Gateway > Custom Domain Names (Sydney ap-southeast-2 region)
0.  Delete pkgzip.com custom domain name
0.  Create new pkgzip.com custom domain name (domain pkgzip.com, choose certificate, path = `/`, set up path mapping to dev-morty:dev)

![Morty](https://i.imgur.com/BQoEXts.png)
