**Note:** this project is no longer maintained, but has been made public since people online have expressed interest. Pull requests will not be accepted and no support will be provided, but you are welcome to fork the project if it is useful to you. In many cases you will be better off just using https://codesandbox.io :)

---

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
