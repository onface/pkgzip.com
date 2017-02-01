function parsePkgTag(pkgDef) {
  const parts = pkgDef.split('@');
  if (pkgDef.indexOf('@') === 0) {
    const [, pkgName, pkgVersion] = parts;
    return pkgName ? {
      pkgName: `@${pkgName}`,
      pkgVersion,
    } : null;
  }
  const [pkgName, pkgVersion] = parts;
  return pkgName ? { pkgName, pkgVersion } : null;
}

export default parsePkgTag;
