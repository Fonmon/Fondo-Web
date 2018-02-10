#!/bin/bash
set -x

cd /home/ubuntu/Fondo-DevOps/

docker run -d -p 80:80 -p 443:443 \
	--name fondo_web \
	-v $(pwd)/front/nginx.conf:/etc/nginx/nginx.conf \
	-v $(pwd)/front/static_files/:/usr/share/nginx/html/static_files \
	-v $(pwd)/certificates/web/:/etc/nginx/certs/web \
	-v $(pwd)/certificates/api/:/etc/nginx/certs/api \
	--net fondo_network \
	fonweb_image:$1
