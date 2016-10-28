rm -rf frogmarch/dist/
npm run dist/lambda
cp package.json frogmarch/
cd frogmarch
npm install --production
AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY serverless deploy || true
AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY serverless invoke --function hello
cd ..
