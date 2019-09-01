import cdk = require('@aws-cdk/core');
import cloudfront = require('@aws-cdk/aws-cloudfront');
import s3 = require('@aws-cdk/aws-s3');
import ec2 = require("@aws-cdk/aws-ec2");
import ecs = require("@aws-cdk/aws-ecs");
import ecs_patterns = require("@aws-cdk/aws-ecs-patterns");
import sm = require("@aws-cdk/aws-secretsmanager");
import elbv2 = require("@aws-cdk/aws-elasticloadbalancingv2");

interface Props extends cdk.StackProps {
  staging_secret: sm.Secret
}

export default class StagingStack extends cdk.Stack {
  readonly distribution: cloudfront.CloudFrontWebDistribution;
  readonly deploy_bucket: s3.Bucket;
  readonly service: ecs.Ec2Service;
  readonly api_url: string;

  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id, props);

    this.deploy_bucket = new s3.Bucket(this, 'DeployBucket', {
      websiteIndexDocument: 'index.html'
    });

    this.deploy_bucket.grantPublicAccess();

    this.distribution = new cloudfront.CloudFrontWebDistribution(this, 'Distribution', {
      defaultRootObject: 'index.html',
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: this.deploy_bucket
          },
          behaviors: [{
            minTtl: cdk.Duration.days(1),
            maxTtl: cdk.Duration.days(30),
            isDefaultBehavior: true
          }]
        }
      ],
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.ALLOW_ALL
    });

    const vpc = new ec2.Vpc(this, "StagingVpc", {
      maxAzs: 2 // Default is all AZs in region
    });

    const cluster = new ecs.Cluster(this, "StagingCluster", {
      vpc: vpc,
    });

    const asg = cluster.addCapacity('EC2Autoscaling', {
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO
      ),
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE
      }
    });

    const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
      vpc,
      internetFacing: true
    });

    this.api_url = `http://${lb.loadBalancerDnsName}`;

    const listener = lb.addListener('Listener', {
      port: 80,
    });

    listener.addTargets('Target', {
      port: 80,
      targets: [asg]
    });

    listener.connections.allowDefaultPortFromAnyIpv4('Open to the world');

    asg.scaleOnRequestCount('AModestLoad', {
      targetRequestsPerSecond: 1
    });


    const taskDefinition = new ecs.Ec2TaskDefinition(this, 'StagingTaskDef');

    const apiDefinition = new ecs.ContainerDefinition(this, 'ApiContainer', {
      taskDefinition,
      image: ecs.ContainerImage.fromRegistry(
        this.node.tryGetContext('ImageRepoName')
      ),
      memoryReservationMiB: 200,
      logging: new ecs.AwsLogDriver({
        streamPrefix: this.stackName
      }),
      environment: {
        MONGO_URI: props.staging_secret.secretValueFromJson('MongoURI').toString(),
        AUTH_SECRET: props.staging_secret.secretValueFromJson('RandomString').toString()
      }
    });

    apiDefinition.addPortMappings({
      containerPort: 4000,
      hostPort: 80
    });

    this.service = new ecs.Ec2Service(this, 'StagingService', {
      cluster,
      taskDefinition,
      maxHealthyPercent: 100,
      minHealthyPercent: 0
    })
  }
}
