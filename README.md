# frogmarch

Frogmarches your npm packages via webpack into a single JS file.

Currently in testing, will be deployed to micros soon. Ideal for Connect developers to consume AtlasKit components.

### Usage

```html
<script src="https://frogmarch.internal.app.dev.atlassian.io/bundle.js?packages=ak-navigation@11.2.1,ak-button@1.6.0"></script>
```

### Dev setup

```bash
npm install
npm run dev
```

### Deploying to micros

```bash
npm run micros/publish-and-deploy/full # replaces the entire stack
```

If you want a faster but riskier update, replace `full` with `fast`.

### wtf frogmarch

![Frogmarching a frog](https://bitbucket.org/repo/qbqoG9/images/3560229856-Screen%20Shot%202016-10-21%20at%2011.00.02%20am.png)
