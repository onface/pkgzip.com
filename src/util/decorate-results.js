import camelcase from 'camelcase';

function decorateResults(allPkgNames, resultsBlob) {
  const helpText = allPkgNames.map(pkg => `\n// window.pkgzip['${camelcase(pkg)}']`).join('');

  return resultsBlob && `// The following objects are now available!:
${helpText}

// ============
${resultsBlob}`;
}

export default decorateResults;
