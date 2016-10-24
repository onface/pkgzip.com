import resolveVersion from './resolve-version';
import { TIMER_VERSION_EXPANSION_TOTAL } from './timer-keys';

function expandVersions(requestedPkgs) {
  console.time(TIMER_VERSION_EXPANSION_TOTAL); // eslint-disable-line no-console
  const expandPromises = requestedPkgs.map(pkg => resolveVersion(pkg.pkgName, pkg.pkgVersion));
  return Promise.all(expandPromises).then((allExpansionResults) => {
    console.timeEnd(TIMER_VERSION_EXPANSION_TOTAL); // eslint-disable-line no-console
    return allExpansionResults.filter(pkg => !!pkg.pkgVersion);
  });
}

export default expandVersions;
