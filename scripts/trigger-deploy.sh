#!/bin/bash
set -x

$HOST_APP=cloud-fonmon.minagle.com

echo $TRAVIS_BRANCH

cd $TRAVIS_BUILD_DIR/
echo "export const HOST_APP = \"https://${HOST_APP}/\";" > src/utils/Constants.js
GENERATE_SOURCEMAP=false npm run build

cd $TRAVIS_BUILD_DIR/container
docker build -t fonmon_web -f ./Dockerfile ..
docker tag fonmon_web:latest us.gcr.io/notificationstest-90976/fonmon_web:dev

gcloud -q auth configure-docker
docker push us.gcr.io/notificationstest-90976/fonmon_web:dev

exit 0