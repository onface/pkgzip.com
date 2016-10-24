# frogmarch

Frogmarches your npm packages via webpack into a single JS file.

Currently in testing, will be deployed to micros soon. Ideal for Connect developers to consume AtlasKit components.

### Usage

```html
<script src="https://frogmarch.internal.app.dev.atlassian.io/bundle.js?packages=ak-navigation@11.2.1,ak-button"></script>
```

### API

Package versions can be specified with the common [semver](http://semver.org) formats:

-  Fixed versions - `ak-navigation@11.2.1`
-  .x versions - `ak-navigation@11.x`
-  Caret versions - `ak-navigation@^11.2.1`
-  Tilde versions - `ak-navigation@~11.2.1`
-  ..as well as `<1.x <=1.x >=1.x >1.x`

By default results are bundled but unminified. Use `bundle.min.js` to enable minification.

### Caching

After your request has been expanded (e.g. `ak-navigation@11.x ==> ak-navigation@11.2.1`), the result is cached indefinitely to S3 for faster results next time.

### Dev setup

```bash
yarn # or `npm install`
npm run dev
```

### Deploying to micros

```bash
npm run micros/publish-and-deploy/full # replaces the entire stack
```

If you want a faster but riskier update, replace `full` with `fast`.

### wtf frogmarch

![Frogmarching a frog](https://bitbucket.org/repo/qbqoG9/images/3560229856-Screen%20Shot%202016-10-21%20at%2011.00.02%20am.png)
