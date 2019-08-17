
import { Fn, IAM, Template, CodeBuild, Refs } from 'cloudform';

const build_template_parameters: Template['Parameters'] = {
  ImageRepoName: {
    Type: 'String',
    Description: 'Provide docker image repo name.'
  },
  ImageUserName: {
    Type: 'String',
    Description: 'Docker user name.'
  },
  GithubRepoUrl: {
    Type: 'String',
    Description: 'Github repo link.'
  },
  DockerHubPasswordArn: {
    Type: 'String',
    Description: 'SSM Arn of Password to access docker hub.'
  },
  GithubOwner: {
    Type: 'String',
    Default: 'alanbo',
    Description: 'Github repo owner'
  },
  GithubRepo: {
    Type: 'String',
    Default: 'social-network-starter-kit',
    Description: 'Github repo name'
  }
};

const build_template_resources: Template['Resources'] = {
  CodeBuildRole: new IAM.Role({
    RoleName: 'CodeBuildRole',
    AssumeRolePolicyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            Service: 'codebuild.amazonaws.com'
          },
          Action: 'sts:AssumeRole'
        }
      ]
    },
    Policies: [
      {
        PolicyName: 'CodeBuildPolicy',
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: [
                'logs:CreateLogGroup',
                'logs:CreateLogStream',
                'logs:PutLogEvents'
              ],
              Resource: [
                '*'
              ]
            },
            {
              Effect: 'Allow',
              Action: [
                'ssm:GetParameters'
              ],
              Resource: [
                Fn.Ref('DockerHubPasswordArn')
              ]
            },
            {
              Effect: 'Allow',
              Action: [
                's3:GetObject',
                's3:GetObjectVersion',
                's3:GetBucketVersioning',
                's3:PutObject'
              ],
              Resource: [
                Fn.Join('', [
                  Fn.GetAtt('PipelineBucket', 'Arn'),
                  '/*'
                ]),
              ]
            },
            {
              Effect: 'Allow',
              Action: [
                's3:GetObject',
                's3:GetObjectVersion',
                's3:GetBucketVersioning',
                's3:PutObject',
                's3:PutObjectAcl'
              ],
              Resource: [
                Fn.Join('', [
                  Fn.GetAtt('DeployBucket', 'Arn'),
                  '/*'
                ]),
              ]
            },
            {
              Effect: 'Allow',
              Action: [
                'logs:CreateLogGroup',
                'logs:CreateLogStream',
                'logs:PutLogEvents',
                'cloudfront:CreateInvalidation'
              ],
              Resource: [
                '*'
              ]
            }
          ]
        }
      }
    ]
  }),
  CodeBuildProject: new CodeBuild.Project({
    Artifacts: {
      Type: 'CODEPIPELINE',
      Name: Refs.StackName
    },
    Description: 'Code Build for Social Network Starter Kit',
    Environment: {
      Type: 'LINUX_CONTAINER',
      Image: 'aws/codebuild/standard:2.0',
      ComputeType: 'BUILD_GENERAL1_SMALL',
      PrivilegedMode: true,
      EnvironmentVariables: [
        {
          Name: 'IMAGE_REPO_NAME',
          Value: Fn.Ref('ImageRepoName')
        },
        {
          Name: 'IMAGE_USER_NAME',
          Value: Fn.Ref('ImageUserName')

        },
        {
          Name: 'DEPLOY_BUCKET',
          Value: Fn.Ref('DeployBucket')
        },
        {
          Name: 'DISTRIBUTION',
          Value: Fn.Ref('Distribution')
        }
      ]
    },
    ServiceRole: 'CodeBuildRole',
    Source: {
      Type: 'CODEPIPELINE'
    },
    TimeoutInMinutes: 10
  }).dependsOn('CodeBuildRole'),

  DeployBucket: {
    Type: 'AWS::S3::Bucket',
    Properties: {
      WebsiteConfiguration: {
        IndexDocument: 'index.html'
      }
    }
  },
  Distribution: {
    Type: 'AWS::CloudFront::Distribution',
    Properties: {
      DistributionConfig: {
        Origins: [
          {
            DomainName: Fn.GetAtt('DeployBucket', 'DomainName'),
            Id: Fn.Ref('DeployBucket'),
            S3OriginConfig: {
              OriginAccessIdentity: ''
            }
          }
        ],
        DefaultRootObject: 'index.html',
        Enabled: true,
        DefaultCacheBehavior: {
          MinTTL: 86400,
          MaxTTL: 31536000,
          ForwardedValues: {
            QueryString: true
          },
          TargetOriginId: Fn.Ref('DeployBucket'),
          ViewerProtocolPolicy: 'redirect-to-https'
        }
      }
    }
  },
  CodePipeline: {
    Type: 'AWS::CodePipeline::Pipeline',
    Properties: {
      RoleArn: Fn.GetAtt('CodePipeLineRole', 'Arn'),
      ArtifactStore: {
        Location: Fn.Ref('PipelineBucket'),
        Type: 'S3'
      },
      Stages: [
        {
          Name: 'Source',
          Actions: [
            {
              Name: 'SourceAction',
              ActionTypeId: {
                Category: 'Source',
                Owner: 'ThirdParty',
                Provider: 'GitHub',
                Version: 1
              },
              OutputArtifacts: [
                {
                  Name: Refs.StackName
                }
              ],
              Configuration: {
                Owner: Fn.Ref('GithubOwner'),
                Repo: Fn.Ref('GithubRepo'),
                Branch: 'master',
                OAuthToken: '{{resolve:secretsmanager:SocialNetworkStarterKitSecrets:SecretString:GithubOAuthToken}}'
              }
            }
          ]
        },
        {
          Name: 'Build',
          Actions: [
            {
              Name: 'BuildAction',
              ActionTypeId: {
                Category: 'Build',
                Owner: 'AWS',
                Version: 1,
                Provider: 'CodeBuild'
              },
              InputArtifacts: [
                {
                  Name: Refs.StackName
                }
              ],
              OutputArtifacts: [
                {
                  Name: Fn.Join('', [
                    Refs.StackName,
                    'Build'
                  ])
                }
              ],
              Configuration: {
                ProjectName: Fn.Ref('CodeBuildProject')
              }
            }
          ]
        }
      ]
    }
  },
  CodePipeLineRole: {
    Type: 'AWS::IAM::Role',
    Properties: {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: {
              Service: [
                'codepipeline.amazonaws.com'
              ]
            },
            Action: [
              'sts:AssumeRole'
            ]
          }
        ]
      },
      Policies: [
        {
          PolicyName: 'root',
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: [
                  's3:GetObject',
                  's3:GetObjectVersion',
                  's3:GetBucketVersioning',
                  's3:PutObject'
                ],
                Resource: [
                  Fn.Join('', [
                    Fn.GetAtt('PipelineBucket', 'Arn'),
                    '/*'
                  ]),
                ]
              },
              {
                Effect: 'Allow',
                Action: [
                  'codebuild:BatchGetBuilds',
                  'codebuild:StartBuild'
                ],
                Resource: '*'
              }
            ]
          }
        }
      ]
    }
  },
  PipelineBucket: {
    Type: 'AWS::S3::Bucket',
    Properties: {}
  }
};

export {
  build_template_parameters,
  build_template_resources
};

