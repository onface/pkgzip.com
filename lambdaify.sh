serverless --version
rm -rf frogmarch/dist/
rm -rf frogmarch/.serverless
rm -rf frogmarch/node_modules
rm -f frogmarch/yarn.lock
npm run dist/lambda
cp package.json frogmarch/
cd frogmarch
yarn install --production
rm yarn.lock
sleep 2
AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY serverless deploy
# AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY serverless invoke --function hello
cd ..
