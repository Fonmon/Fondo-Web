FROM nginx:1.13

RUN apt-get update
RUN apt-get install -my curl gnupg lua5.1 liblua5.1-0 liblua5.1-0-dev
RUN curl -sL https://deb.nodesource.com/setup_9.x | bash
RUN apt-get install -y nodejs && \
    apt-get install -y build-essential

RUN ln -s /usr/lib/x86_64-linux-gnu/liblua5.1.so /usr/lib/liblua.so

WORKDIR /app
ARG HOST_APP

ENV HOST_API_URL=${HOST_APP}

COPY . /app
RUN echo "export const HOST_APP = \"https://${HOST_APP}/\";" > src/utils/Constants.js

RUN npm install
RUN npm run build
RUN /bin/bash -c "cp -r build/* /usr/share/nginx/html"

EXPOSE 80 443

CMD nginx -g 'daemon off;'
