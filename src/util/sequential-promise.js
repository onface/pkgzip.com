export default function (iterable, applyFn) {
  return iterable.reduce((p, item) => p.then(applyFn(item)), Promise.resolve());
}
