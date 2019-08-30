import cdk = require('@aws-cdk/core');
import cloudfront = require('@aws-cdk/aws-cloudfront');
import s3 = require('@aws-cdk/aws-s3');
import ec2 = require("@aws-cdk/aws-ec2");
import ecs = require("@aws-cdk/aws-ecs");

export default class StagingStack extends cdk.Stack {
  readonly distribution: cloudfront.CloudFrontWebDistribution;
  readonly deploy_bucket: s3.Bucket;
  readonly service: ecs.Ec2Service;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
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
      maxAzs: 1 // Default is all AZs in region
    });

    const cluster = new ecs.Cluster(this, "StagingCluster", {
      vpc: vpc,
      // capacity: 
    });

    const autoscaling = cluster.addCapacity('EC2Autoscaling', {
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO
      ),
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC
      }
    });

    const taskDefinition = new ecs.Ec2TaskDefinition(this, 'StagingTaskDef');

    const apiDefinition = new ecs.ContainerDefinition(this, 'ApiContainer', {
      taskDefinition,
      image: ecs.ContainerImage.fromRegistry(
        this.node.tryGetContext('ImageRepoName')
      ),
      memoryReservationMiB: 200,
      hostname: 'api'
    });

    apiDefinition.addPortMappings({
      containerPort: 27017,
      hostPort: 27017
    });

    const mongoDefinition = new ecs.ContainerDefinition(this, 'MongoContainer', {
      taskDefinition,
      image: ecs.ContainerImage.fromRegistry(
        (this.node.tryGetContext('ImageRepoName') as string) + '-mongo'
      ),
      memoryReservationMiB: 700,
      hostname: 'mongo'
    });

    mongoDefinition.addPortMappings({
      containerPort: 4000,
      hostPort: 80
    });

    this.service = new ecs.Ec2Service(this, 'StagingService', {
      cluster,
      taskDefinition
    })

    // The code that defines your stack goes here
  }
}
