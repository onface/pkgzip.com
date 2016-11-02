SLS="`npm bin`/serverless"
$SLS --version
npm run dist/lambda
cp package.json morty/
cd morty
# yarn install --production
SLS_DEBUG=1 $SLS offline
cd ..
