import cloudform, { Fn, Refs, EC2, ECS, StringParameter, ResourceTag } from "cloudform";
import ecsAmiMappings from './parts/ecs-ami-mappings';
const STACK_NAME = 'social-network-starter-kit';

export default cloudform({
  Mappings: {
    amiIDS: ecsAmiMappings
  },
  Resources: {
    StagingECSCluster: new ECS.Cluster({
      ClusterName: `${STACK_NAME}-ecs-cluster`
    }),

    StagingECSTaskDef: new ECS.TaskDefinition({

    }),

    StagingECSService: new ECS.Service({
      Cluster: Fn.Ref('StagingECSCluster'),
      TaskDefinition: Fn.Ref('StagingECSTaskDef')
    }),

    StagingEC2Instance: new EC2.Instance({
      ImageId: Fn.FindInMap('amiIDS', Refs.Region, 'imageId')
    })
  }

});