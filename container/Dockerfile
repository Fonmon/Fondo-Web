FROM nginx:1.13

RUN apt-get update
RUN apt-get install -my curl gnupg 
RUN curl -sL https://deb.nodesource.com/setup_9.x | bash
RUN apt-get install -y nodejs && \
    apt-get install -y build-essential

WORKDIR /app
ARG HOST_APP

ENV HOST_API_URL=${HOST_APP}

COPY . /app
RUN echo "export const HOST_APP = \"https://${HOST_APP}/\";" > src/utils/Constants.js

RUN npm install
RUN npm run build
RUN /bin/bash -c "cp -r build/* /usr/share/nginx/html"

RUN /bin/bash -c "ls -l"
RUN /bin/bash -c "ls -l container"
# nginx resolv env variables
RUN envsubst '$HOST_API_URL' < container/nginx.conf > /etc/nginx/nginx.conf

EXPOSE 80 443

CMD nginx -g 'daemon off;'
