#!/usr/bin/env bash

source .cf-env

aws cloudformation update-stack \
  --stack-name "$stack_name" \
  --template-body file:///$PWD/.build/template.out \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --parameters \
ParameterKey=DockerHubPasswordArn,\
ParameterValue=$dhub_password_arn \
ParameterKey=ImageRepoName,\
ParameterValue=$dhub_repo_name \
ParameterKey=ImageUserName,\
ParameterValue=$docker_user_name \
ParameterKey=GithubRepoUrl,\
ParameterValue=$github_repo_name