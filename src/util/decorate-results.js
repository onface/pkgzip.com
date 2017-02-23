function decorateResults(allPkgNames, resultsBlob) {
  const helpText = allPkgNames.map(pkg => `\n// window.pkgzip['${pkg}']`).join('');

  return resultsBlob && `// The following objects are now available!:
${helpText}

// ============
${resultsBlob}`;
}

export default decorateResults;
