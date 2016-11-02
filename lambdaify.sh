# fix docker missing pkgs
# npm install glob-all filesize

SLS="`npm bin`/serverless"
$SLS --version

# set up lambda function dir
mkdir morty
cp serverless.yml morty/

# copy module info into morty dir
cp package.json morty/
cp yarn.lock morty/

# install node_moedules in morty dir
cd morty
yarn install --production
npm install bengummer/yarn#lambda-fix --force --legacy-bundling
npm install mkdirp glob-all filesize # needed on lambda for some reason
cd ..

# lint and test
sleep 2
npm run lint
npm run test

# build app into morty dir
npm run dist
cp handler.js morty/

cd morty
SLS_DEBUG=1 AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID" AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY" $SLS deploy --verbose
cd ..
