import fs from 'fs';

function buildEntryFile({ entryFilePath, allPkgNames = [] }) {
  const requireLines = allPkgNames.map(pkg => `\nwindow.pkgzip['${pkg}'] = require('${pkg}');`).join('');
  const entryFileContents = `window.pkgzip = {}; ${requireLines}`;
  fs.writeFileSync(entryFilePath, entryFileContents);
}

// required for proxyquire
module.exports = buildEntryFile;

export default buildEntryFile;
