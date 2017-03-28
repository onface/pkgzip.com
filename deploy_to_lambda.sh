# fix docker missing pkgs (TODO: see if this line can be removed)
npm install glob-all filesize

SLS="`npm bin`/serverless"
$SLS --version

# set up lambda function dir
mkdir morty
cp serverless.yml morty/

# copy module info into morty dir
cp package.json morty/
cp yarn.lock morty/

# install node_modules in morty dir
cd morty
npm i --production # not using --only=production because we are on npm 2.x
ls node_modules
npm install bengummer/yarn#lambda-fix --force --legacy-bundling # TODO: see if can remove
npm install mkdirp glob-all filesize graceful-fs # needed on lambda for some reason. TODO: see if can remove
cd ..

# lint and test
sleep 2

# build app to handler.js
npm run dist

# copy app into morty dir and deploy
cp handler.js morty/
cd morty
SLS_DEBUG=1 AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID" AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY" $SLS deploy --verbose
cd ..
