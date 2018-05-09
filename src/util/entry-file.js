// @flow

import fs from 'fs';

type EntryObjectType = {
  entryFilePath: string,
  allPkgNames: Array<string>,
}

function buildEntryFile({ entryFilePath, allPkgNames = [] } : EntryObjectType) {
  const requireLines = allPkgNames.map(pkg => `\nwindow.pkgzip['${pkg}'] = require('${pkg}');`).join('');
  const entryFileContents = `if (typeof window !== 'undefined') { window.pkgzip = window.pkgzip || {}; ${requireLines} }`;
  fs.writeFileSync(entryFilePath, entryFileContents);
}

// required for proxyquire
module.exports = buildEntryFile;

// $FlowFixMe
export default buildEntryFile;
