set -e

npm version patch

IMG_NAME="docker.atlassian.io/bgummer/frogmarch"
NEW_VERSION=`node -e "console.log(require('./package.json').version);"`
echo "New version is $NEW_VERSION"

NEW_IMAGE="$IMG_NAME:v$NEW_VERSION"

docker build -t "$NEW_IMAGE" .
docker push "$NEW_IMAGE"
