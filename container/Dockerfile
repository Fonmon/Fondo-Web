# docker build -t fonmon_web -f ./Dockerfile --build-arg HOST_APP= ..
FROM nginx:alpine

RUN apk update && apk add ca-certificates && update-ca-certificates
RUN apk add --no-cache nodejs nodejs-npm
RUN apk add --no-cache gettext

WORKDIR /app
ARG HOST_APP

ENV GENERATE_SOURCEMAP=false

COPY package.json .
RUN npm install

COPY . /app
RUN echo "export const HOST_APP = \"https://${HOST_APP}/\";" > src/utils/Constants.js

RUN npm run build
RUN cp -r build/* /usr/share/nginx/html

# nginx resolv env variables
# RUN envsubst < container/nginx.conf > /etc/nginx/nginx.conf
COPY container/nginx.conf /etc/nginx/nginx.conf

CMD nginx -g 'daemon off;'
