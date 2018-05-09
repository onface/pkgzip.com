// @flow

const deprecationMsg = [
  'END OF LIFE NOTICE: PKGZIP SERVICE IS DEPRECATED AND WILL STOP WORKING ON JANUARY 1 2018.',
  'THANK YOU FOR USING PKGZIP, BUT WE ARE SWITCHING IT OFF AS THERE ARE MUCH BETTER TOOLS',
  'OUT THERE NOW, SUCH AS THE AWESOME CODESANDBOX.IO',
].join(' ');

function decorateResults(allPkgNames: Array<string>, resultsBlob: string) {
  const helpText = allPkgNames.map(pkg => `\n// window.pkgzip['${pkg}']`).join('');

  return resultsBlob && `
  // console.warn(${JSON.stringify(deprecationMsg)});

// The following objects are now available!:
${helpText}

// ============
${resultsBlob}`;
}

export default decorateResults;
