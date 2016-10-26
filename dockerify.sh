set -e
DEPLOY_MODE=$1
DEPLOY_ENV=$2
MICROS_TOKEN=$bamboo_MICROS_TOKEN_PASSWORD

### NOTE: This is meant to be run via Bamboo.
### The `sed` command below will fail on Mac.

# bump version
NEW_VERSION=`date +"1.0.0-%F-%H-%M-%S"`

# work out new docker tag name
IMG_NAME="docker.atlassian.io/atlassian/frogmarch"
NEW_IMAGE="$IMG_NAME:v$NEW_VERSION"
echo "New version is $NEW_VERSION"

# build new docker img and push
docker build -t "$NEW_IMAGE" .
docker push "$NEW_IMAGE"

# write new version to micros service descriptor
sed -i "s/tag: .*/tag: v${NEW_VERSION}/" frogmarch.sd.yml

# publish to micros in fast mode
sleep 10
MICROS_TOKEN=$MICROS_TOKEN "$(npm bin)/micros" service:$DEPLOY_MODE frogmarch -f frogmarch.sd.yml -e $DEPLOY_ENV
