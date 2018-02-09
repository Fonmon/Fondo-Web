FROM nginx:1.13

RUN apt-get update
RUN apt-get install -y curl && \
    apt-get install -my wget gnupg unzip
RUN curl -sL https://deb.nodesource.com/setup_9.x | bash
RUN apt-get install -y nodejs && \
    apt-get install -y build-essential

WORKDIR /app

ADD https://github.com/Fonmon/Fondo-Web/archive/master.zip /app
RUN unzip master.zip && rm master.zip

WORKDIR /app/Fondo-Web-master

#RUN /bin/bash -c "ls -la"

RUN npm install
RUN npm run build
RUN /bin/bash -c "cp -r build/* /usr/share/nginx/html"

EXPOSE 80 443

CMD nginx -g 'daemon off;'

