set -e
DEPLOY_MODE=$1
DEPLOY_ENV=$2

# debugging
echo "== DEBUGGING =="
node --version
npm --version
which micros
echo "micros location: $(npm bin)/micros"
printenv

# bump npm version
npm version patch
NEW_VERSION=`node -e "console.log(require('./package.json').version);"`

# work out new docker tag name
IMG_NAME="docker.atlassian.io/bgummer/frogmarch"
NEW_IMAGE="$IMG_NAME:v$NEW_VERSION"
echo "New version is $NEW_VERSION"

# build new docker img and push
docker build -t "$NEW_IMAGE" .
docker push "$NEW_IMAGE"

# write new version to micros service descriptor
sed -i "s/tag: .*/tag: v${NEW_VERSION}/" frogmarch.sd.yml
rm -f frogmarch.sd.yml.bak
git add frogmarch.sd.yml
git commit -m "chore: updating service descriptor to v$NEW_VERSION"

# publish to micros in fast mode
sleep 10
MICROS_TOKEN=$bamboo_MICROS_TOKEN_PASSWORD "$(npm bin)/micros" service:$DEPLOY_MODE frogmarch -f frogmarch.sd.yml -e $DEPLOY_ENV
