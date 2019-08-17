import cloudform from "cloudform";
import ecsAmiMappings from './parts/ecs-ami-mappings';
import { build_template_parameters, build_template_resources } from './parts/pipeline';
import staging_template_resources from './parts/staging';

export default cloudform({
  Parameters: {
    ...build_template_parameters
  },
  Mappings: {
    amiIDS: ecsAmiMappings
  },
  Resources: {
    ...build_template_resources,
    ...staging_template_resources
  }
});