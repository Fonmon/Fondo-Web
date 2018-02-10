#!/bin/bash
set -x

# Validation is not added but 2 arguments are
# mandatory for running this script

docker build -t fonweb_image:$1 \
	--build-arg HOST_APP=$2 \
	-f container/Dockerfile \
	.
