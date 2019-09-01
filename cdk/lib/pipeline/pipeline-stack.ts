import cdk = require('@aws-cdk/core');
import iam = require('@aws-cdk/aws-iam');
import codebuild = require('@aws-cdk/aws-codebuild');
import s3 = require('@aws-cdk/aws-s3');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import codepipeline_actions = require('@aws-cdk/aws-codepipeline-actions');
import cloudfront = require('@aws-cdk/aws-cloudfront');
import sm = require("@aws-cdk/aws-secretsmanager");
import ecs = require("@aws-cdk/aws-ecs");

interface StagingStackProps extends cdk.StackProps {
  distribution: cloudfront.CloudFrontWebDistribution,
  deploy_bucket: s3.Bucket,
  service: ecs.Ec2Service,
  api_url: string,
  staging_secret: sm.Secret
}

export default class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: StagingStackProps) {
    super(scope, id, props);
    const pipeline_bucket = new s3.Bucket(this, 'PipelineBucket');

    const code_build_role = new iam.Role(this, 'CodeBuildRole', {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
      inlinePolicies: {
        CodeBuildPolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'logs:CreateLogGroup',
                'logs:CreateLogStream',
                'logs:PutLogEvents'
              ],
              resources: ['*']
            }),
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'secretsmanager:DescribeSecret',
                'secretsmanager:GetSecretValue'
              ],
              resources: [
                props.staging_secret.secretArn
              ]
            }),
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'cloudfront:CreateInvalidation'
              ],
              resources: ['*']
            })
          ]
        })
      }
    });

    const pipeline_project = new codebuild.PipelineProject(this, 'CodeBuildProject', {
      role: code_build_role,
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_2_0,
        privileged: true,
        computeType: codebuild.ComputeType.SMALL,
        environmentVariables: {
          'IMAGE_REPO_NAME': {
            value: this.node.tryGetContext('ImageRepoName'),
          },
          'IMAGE_USER_NAME': {
            value: this.node.tryGetContext('ImageUserName')
          },
          'DEPLOY_BUCKET': {
            value: props.deploy_bucket.bucketName
          },
          'DISTRIBUTION': {
            value: props.distribution.distributionId
          },
          'REACT_APP_API_URI': {
            value: props.api_url
          },
          'SECRET_ARN': {
            value: props.staging_secret.secretArn
          }
        }
      }
    });

    props.deploy_bucket.grantReadWrite(code_build_role);
    pipeline_bucket.grantReadWrite(code_build_role);

    const sourceOutput = new codepipeline.Artifact();
    const cdkBuildOutput = new codepipeline.Artifact('CdkBuildOutput');

    const pipeline = new codepipeline.Pipeline(this, 'CodePipeline', {
      artifactBucket: pipeline_bucket,
      stages: [
        {
          stageName: 'Source',
          actions: [
            new codepipeline_actions.GitHubSourceAction({
              owner: this.node.tryGetContext('GithubOwner'),
              oauthToken: props.staging_secret.secretValueFromJson('GithubOAuthToken'),
              repo: this.node.tryGetContext('GithubRepo'),
              actionName: 'SourceAction',
              output: sourceOutput
            }),
          ]
        },
        {
          stageName: 'Build',
          actions: [
            new codepipeline_actions.CodeBuildAction({
              input: sourceOutput,
              outputs: [cdkBuildOutput],
              actionName: 'BuildAction',
              project: pipeline_project
            }),
          ]
        },
        {
          stageName: 'Deploy',
          actions: [
            new codepipeline_actions.EcsDeployAction({
              input: cdkBuildOutput,
              service: props.service,
              actionName: 'DeployAction'
            })
          ]
        }
      ]
    });
  }
}
