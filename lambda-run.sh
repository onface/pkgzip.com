serverless --version
# rm -rf frogmarch/dist/
npm run dist/lambda
cp package.json frogmarch/
cd frogmarch
yarn install --production
SLS_DEBUG=1 serverless run -f hello
cd ..
