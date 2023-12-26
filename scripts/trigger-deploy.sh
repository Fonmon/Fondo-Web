#!/bin/bash
set -x

######################################################
# Script that trigger deploy process for web layer   #
# in server side.                                    #
######################################################

if [ $CODEBUILD_WEBHOOK_EVENT == 'PUSH' ] && [ $CODEBUILD_WEBHOOK_HEAD_REF == 'refs/heads/master' ]; then
	# Triggering deploy process
	echo 'Starting trigger'
	aws ssm send-command \
		--document-name "AWS-RunShellScript" \
		--comment "Deploying web layer" \
		--instance-ids "i-06e827f552c3f56a0" \
		--parameters commands="entrypoint_deploy master web master" \
		--output text
	echo 'Deploying in background'
	exit 0
fi
