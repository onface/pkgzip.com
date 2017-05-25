// @flow

function decorateResults(allPkgNames: Array<string>, resultsBlob: string) {
  const helpText = allPkgNames.map(pkg => `\n// window.pkgzip['${pkg}']`).join('');

  return resultsBlob && `// The following objects are now available!:
${helpText}

// ============
${resultsBlob}`;
}

export default decorateResults;
