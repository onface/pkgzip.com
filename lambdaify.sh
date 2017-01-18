# fix docker missing pkgs
npm install glob-all filesize

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
yarn
# npm install bengummer/yarn#lambda-fix --force --legacy-bundling
npm install mkdirp glob-all filesize # needed on lambda for some reason
cd ..

# lint and test
sleep 2
npm run lint
npm run test

# build app
npm run dist

# run integration-test
FROG_AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID" FROG_AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY" npm run integration-test

# copy app into morty dir and deploy
cp handler.js morty/
cd morty
SLS_DEBUG=1 AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID" AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY" $SLS deploy --verbose
cd ..
