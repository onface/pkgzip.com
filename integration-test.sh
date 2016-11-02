#!/usr/bin/env bash
set -e

yarn

sleep 2

`npm bin`/sls offline --dontPrintOutput --noTimeout --stage=dev&

sleep 2

OUTPUT="$(curl -s http://localhost:3000/bundle.js)"
echo $OUTPUT
if [[ $OUTPUT != *"Please supply at least 1 npm package name in the packages parameter"* ]]
then
  echo "Should return 'Please supply at least 1 npm package name in the packages parameter'";
  exit 1;
fi

OUTPUT="$(curl -Is http://localhost:3000/bundle.js?packages=ak-button)"
echo $OUTPUT
if [[ $OUTPUT != *"Location:"* ]]
then
  echo "Should redirect on fuzzy version";
  exit 1;
fi

OUTPUT="$(curl -s http://localhost:3000/bundle.js?packages=left-pad@1.1.3)"
echo $OUTPUT
if [[ $OUTPUT != *"webpackUniversalModuleDefinition"* ]]
then
  echo "Should return actual code for fixed version";
  exit 1;
fi

echo ""
echo "=== ALL GOOD! ==="
