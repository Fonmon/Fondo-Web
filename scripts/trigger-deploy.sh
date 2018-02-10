#!/bin/bash
set -x

######################################################
# Script that trigger deploy process for web layer   #
# in server side.                                    #
######################################################

# Arguments length: 2
# 1: commit number
# 2: instance ID
# 3: env
if [  $# -ne 3 ]; then
	echo 'Arguments: commit_revision instance_id {master|develop}'
	exit 1
fi

COMMIT=$1
INSTANCE=$2
ENV=$3

# Triggering deploy process
echo 'Starting trigger'
aws ssm send-command \
	--document-name "AWS-RunShellScript" \
	--comment "Deploying web layer" \
	--instance-ids "${INSTANCE}" \
	--parameters commands="entrypoint_deploy ${COMMIT} web ${ENV}" \
	--output text
echo 'Deploying in background'
exit 0
