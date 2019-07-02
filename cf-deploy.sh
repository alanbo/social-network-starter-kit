#!/usr/bin/env bash

echo "Provide Arn of dhub_password in SSM:"
read dhub_password_arn

echo "Provide docker user name:"
read docker_user_name

echo "Provide docker repo name:"
read dhub_repo_name

echo "Provide github repo url:"
read github_repo_name

aws cloudformation create-stack \
  --stack-name social-network-starter-kit \
  --template-body file:///$PWD/cloud-formation-resources.yml \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --parameters \
ParameterKey=DockerHubPasswordArn,\
ParameterValue=$dhub_password_arn \
ParameterKey=ImageRepoName,\
ParameterValue=$docker_user_name/$dhub_repo_name \
ParameterKey=ImageUserName,\
ParameterValue=$docker_user_name \
ParameterKey=GithubRepoUrl,\
ParameterValue=$github_repo_name
