#!/usr/bin/env bash

echo "Provide Arn of dhub_password in SSM:"
read dhub_password_arn
echo "export dhub_password_arn=\"$dhub_password_arn\"" >> .cf-env

echo "Provide docker user name:"
read docker_user_name
echo "export docker_user_name=\"$docker_user_name\"" >> .cf-env

echo "Provide docker repo name:"
read dhub_repo_name
echo "export dhub_repo_name=\"$dhub_repo_name\"" >> .cf-env

echo "Provide github repo url:"
read github_repo_name
echo "export github_repo_name=\"$github_repo_name\"" >> .cf-env

aws cloudformation create-stack \
  --stack-name social-network-starter-kit \
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
