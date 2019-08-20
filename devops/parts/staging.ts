import cloudform, { Fn, Refs, EC2, ECS, IAM, Logs, Template } from 'cloudform';

const staging_template_resources: Template['Resources'] = {
  StagingECSCluster: new ECS.Cluster({
    // ClusterName: `social-api-staging7-ecs-cluster`,
    ClusterName: Fn.Join('', [
      Refs.StackName,
      '-cluster'
    ])
  }),

  LogGroupApi: new Logs.LogGroup({
    // LogGroupName: '/ecs/social-api-staging7',
    LogGroupName: Fn.Join('', [
      '/',
      Refs.StackName,
      '/staging/api'
    ]),
    RetentionInDays: 7
  }),

  LogGroupMongo: new Logs.LogGroup({
    LogGroupName: Fn.Join('', [
      '/',
      Refs.StackName,
      '/staging/mongo'
    ]),
    RetentionInDays: 7
  }),

  StagingECSTaskDef: new ECS.TaskDefinition({
    ExecutionRoleArn: Fn.GetAtt('StagingECSExecutionRole', 'Arn'),
    ContainerDefinitions: [
      {
        LogConfiguration: {
          LogDriver: 'awslogs',
          Options: {
            'awslogs-group': Fn.Ref('LogGroupMongo'),
            'awslogs-region': 'us-west-2',
            'awslogs-stream-prefix': 'ecs'
          }
        },
        PortMappings: [
          {
            HostPort: 27017,
            Protocol: 'tcp',
            ContainerPort: 27017
          }
        ],
        Image: 'vegewolf/social-api-mongo',
        Name: 'mongo',
        Memory: 256,
        Cpu: 200
      },
      {
        LogConfiguration: {
          LogDriver: 'awslogs',
          Options: {
            'awslogs-group': Fn.Ref('LogGroupApi'),
            'awslogs-region': 'us-west-2',
            'awslogs-stream-prefix': 'ecs'
          }
        },
        PortMappings: [
          {
            HostPort: 80,
            Protocol: 'tcp',
            ContainerPort: 4000
          }
        ],
        Environment: [
          {
            Name: 'AUTH_SECRET',
            Value: '2424$$%%SS522dkssk'
          },
          {
            Name: 'MONGODB_ADMINPASSWORD',
            Value: 'example'
          },
          {
            Name: 'MONGODB_ADMINUSERNAME',
            Value: 'root'
          }
        ],
        Image: 'vegewolf/social-api',
        Essential: true,
        Links: ['mongo'],
        Name: 'api',
        Memory: 256,
        Cpu: 200
      }
    ],
    Memory: '983',
    TaskRoleArn: Fn.GetAtt('StagingECSExecutionRole', 'Arn'),
    RequiresCompatibilities: ['EC2'],
    NetworkMode: 'bridge',
    Cpu: '1024'
  }),

  StagingECSService: new ECS.Service({
    Cluster: Fn.Ref('StagingECSCluster'),
    TaskDefinition: Fn.Ref('StagingECSTaskDef'),
    DesiredCount: 1
  }),

  StagingEC2Instance: new EC2.Instance({
    ImageId: Fn.FindInMap('amiIDS', Refs.Region, 'imageId'),
    // SubnetId: Fn.Ref('StagingPublicSubnet'),
    InstanceType: 't2.micro',
    IamInstanceProfile: 'StagingEC2Profile',
    UserData: Fn.Base64(
      Fn.Join('', [
        '#!/bin/bash\n',
        'echo ECS_CLUSTER=',
        Fn.Ref('StagingECSCluster'),
        ' >> /etc/ecs/ecs.config\n',
        'echo ECS_IMAGE_CLEANUP_INTERVAL=10m >> /etc/ecs/ecs.config\n',
        'echo ECS_IMAGE_MINIMUM_CLEANUP_AGE=1m >> /etc/ecs/ecs.config\n',
        'yum install -y aws-cfn-bootstrap\n',
        '/opt/aws/bin/cfn-signal -e $? --stack ',
        Refs.StackName,
        ' --resource StagingEC2Instance --region ',
        Refs.Region

      ])
    ),
    NetworkInterfaces: [
      {
        AssociatePublicIpAddress: true,
        DeviceIndex: '0',
        SubnetId: Fn.Ref('StagingPublicSubnet'),
        GroupSet: [
          Fn.GetAtt('StagingSecurityGroup', 'GroupId')
        ]
      }
    ]
  }),

  StagingSecurityGroup: new EC2.SecurityGroup({
    GroupDescription: 'Security group for staging EC2 instance',
    SecurityGroupIngress: [
      {
        IpProtocol: 'tcp',
        FromPort: 80,
        ToPort: 80,
        CidrIp: '0.0.0.0/0'
      },
      {
        IpProtocol: 'tcp',
        FromPort: 444,
        ToPort: 444,
        CidrIp: '0.0.0.0/0'
      }
    ],
    VpcId: Fn.Ref('StagingVPC')
  }),

  StagingVPC: new EC2.VPC({
    CidrBlock: '10.1.0.0/16',
    EnableDnsSupport: true,
    EnableDnsHostnames: true,
  }),

  // StagingVPCECSEndpoint: new EC2.VPCEndpoint({
  //   SecurityGroupIds: [
  //     Fn.GetAtt('StagingSecurityGroup', 'GroupId')
  //   ],
  //   SubnetIds: [
  //     Fn.Ref('StagingPrivateSubnet')
  //   ],
  //   ServiceName: Fn.Sub('com.amazonaws.${region}.ecs', { region: Refs.Region }),
  //   VpcId: Fn.Ref('StagingVPC'),
  //   // TO DO: make an improvement to cloudform so that it has an union of 'Interface' and 'Gateway' type
  //   VpcEndpointType: 'Interface'
  // }),

  // StagingVPCECSAgentEndpoint: new EC2.VPCEndpoint({
  //   SecurityGroupIds: [
  //     Fn.GetAtt('StagingSecurityGroup', 'GroupId')
  //   ],
  //   SubnetIds: [
  //     Fn.Ref('StagingPrivateSubnet')
  //   ],
  //   ServiceName: Fn.Sub('com.amazonaws.${region}.ecs-agent', { region: Refs.Region }),
  //   VpcId: Fn.Ref('StagingVPC'),
  //   VpcEndpointType: 'Interface',

  // }),

  // StagingVPCECSTelemetryEndpoint: new EC2.VPCEndpoint({
  //   SecurityGroupIds: [
  //     Fn.GetAtt('StagingSecurityGroup', 'GroupId')
  //   ],
  //   SubnetIds: [
  //     Fn.Ref('StagingPrivateSubnet')
  //   ],
  //   ServiceName: Fn.Sub('com.amazonaws.${region}.ecs-telemetry', { region: Refs.Region }),
  //   VpcId: Fn.Ref('StagingVPC'),
  //   VpcEndpointType: 'Interface'
  // }),

  StagingInternetGateway: new EC2.InternetGateway({

  }).dependsOn('StagingVPC'),

  StagingAttachGateway: new EC2.VPCGatewayAttachment({
    VpcId: Fn.Ref('StagingVPC'),
    InternetGatewayId: Fn.Ref('StagingInternetGateway'),
  }),

  // NatGatewayAttachement: new EC2.EIP({
  //   Domain: 'vpc'
  // }).dependsOn('StagingAttachGateway'),

  // NatGateway: new EC2.NatGateway({
  //   AllocationId: Fn.GetAtt('NatGatewayAttachement', 'AllocationId'),
  //   SubnetId: Fn.Ref('StagingPublicSubnet')
  // }),

  // PrivateRouteTable: new EC2.RouteTable({
  //   VpcId: Fn.Ref('StagingVPC')
  // }),

  // PrivateRoute: new EC2.Route({
  //   RouteTableId: Fn.Ref('PrivateRouteTable'),
  //   DestinationCidrBlock: '0.0.0.0/0',
  //   NatGatewayId: Fn.Ref('NatGateway')
  // }),

  // PrivateRouteTableAssociation: new EC2.SubnetRouteTableAssociation({
  //   RouteTableId: Fn.Ref('PrivateRouteTable'),
  //   SubnetId: Fn.Ref('StagingPrivateSubnet')
  // }),

  StagingPublicSubnet: new EC2.Subnet({
    VpcId: Fn.Ref('StagingVPC'),
    CidrBlock: '10.1.10.0/24',
    AvailabilityZone: Fn.Select(0, Fn.GetAZs())
  }),

  // StagingPrivateSubnet: new EC2.Subnet({
  //   VpcId: Fn.Ref('StagingVPC'),
  //   CidrBlock: '10.1.20.0/24',
  //   AvailabilityZone: Fn.Select(0, Fn.GetAZs())
  // }),

  StagingPublicRouteTable: new EC2.RouteTable({
    VpcId: Fn.Ref('StagingVPC')
  }),

  StagingPublicRoute: new EC2.Route({
    RouteTableId: Fn.Ref('StagingPublicRouteTable'),
    DestinationCidrBlock: '0.0.0.0/0',
    GatewayId: Fn.Ref('StagingInternetGateway')
  }).dependsOn('StagingAttachGateway'),

  StagingPublicSubnetRouteTableAssociation: new EC2.SubnetRouteTableAssociation({
    SubnetId: Fn.Ref('StagingPublicSubnet'),
    RouteTableId: Fn.Ref('StagingPublicRouteTable')
  }),

  StagingECSExecutionRole: new IAM.Role({
    // RoleName: 'social-api-staging7-ecs-execution',
    RoleName: Fn.Join('', [
      Refs.StackName,
      '-execution'
    ]),
    AssumeRolePolicyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            Service: 'ecs-tasks.amazonaws.com'
          },
          Action: 'sts:AssumeRole'
        }
      ]
    },
    Policies: [
      {
        // PolicyName: 'social-api-staging7-ecs-execution',
        PolicyName: Fn.Join('', [
          Refs.StackName,
          '-execution'
        ]),
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: [
                'ecr:GetAuthorizationToken',
                'ecr:BatchCheckLayerAvailability',
                'ecr:GetDownloadUrlForLayer',
                'ecr:BatchGetImage',
                'logs:CreateLogStream',
                'logs:PutLogEvents'
              ],
              Resource: '*'
            }
          ]
        }
      }
    ]
  }),

  StagingECSEC2Role: new IAM.Role({
    RoleName: Fn.Join('', [
      Refs.StackName,
      '-ec2'
    ]),
    AssumeRolePolicyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            Service: 'ec2.amazonaws.com'
          },
          Action: 'sts:AssumeRole'
        }
      ]
    },
    Policies: [
      {
        // PolicyName: 'social-api-staging7-ecs-ec2',
        PolicyName: Fn.Join('', [
          Refs.StackName,
          '-ec2'
        ]),
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: [
                'ec2:DescribeTags',
                'ecs:CreateCluster',
                'ecs:DeregisterContainerInstance',
                'ecs:DiscoverPollEndpoint',
                'ecs:Poll',
                'ecs:RegisterContainerInstance',
                'ecs:StartTelemetrySession',
                'ecs:UpdateContainerInstancesState',
                'ecs:Submit*',
                'ecr:GetAuthorizationToken',
                'ecr:BatchCheckLayerAvailability',
                'ecr:GetDownloadUrlForLayer',
                "ecr:BatchGetImage",
                'logs:CreateLogStream',
                'logs:PutLogEvents'
              ],
              Resource: '*'
            }
          ]
        }
      }
    ]
  }),

  StagingEC2Profile: new IAM.InstanceProfile({
    InstanceProfileName: 'StagingEC2Profile',
    Roles: [Fn.Ref('StagingECSEC2Role')]
  }).dependsOn('StagingECSEC2Role')
}

export default staging_template_resources;