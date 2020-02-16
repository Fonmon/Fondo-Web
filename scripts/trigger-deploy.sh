#!/bin/bash
set -x

PROJECT_ID=notificationstest-90976

if [ $TRAVIS_BRANCH == 'master' ]; then
  HOST_API=api-fonmon.minagle.com
  TAG=stable
  SERVICE=fonmonweb
else
  HOST_API=cloud-api-fonmon.minagle.com
  TAG=dev
  SERVICE=fonmonweb_dev
fi

cd $TRAVIS_BUILD_DIR/
echo "export const HOST_APP = \"https://${HOST_API}/\";" > src/utils/Constants.js
GENERATE_SOURCEMAP=false npm run build

cd $TRAVIS_BUILD_DIR/container
docker build -t fonmon_web -f ./Dockerfile ..
docker tag fonmon_web:latest us.gcr.io/$PROJECT_ID/fonmon_web:$TAG

gcloud -q auth configure-docker
gcloud -q container images delete us.gcr.io/$PROJECT_ID/fonmon_web:$TAG --force-delete-tags
docker push us.gcr.io/$PROJECT_ID/fonmon_web:$TAG
gcloud -q run deploy $SERVICE --platform managed --region us-central1 --image us.gcr.io/$PROJECT_ID/fonmon_web:$TAG

exit 0