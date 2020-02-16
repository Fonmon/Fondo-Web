# docker build -t fonmon_web -f ./Dockerfile --build-arg HOST_APP= ..
FROM nginx:alpine

COPY container/nginx.conf /etc/nginx/nginx.conf
COPY build/ /usr/share/nginx/html

CMD nginx -g 'daemon off;'