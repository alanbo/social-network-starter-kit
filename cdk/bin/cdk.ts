#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import PipelineStack from '../lib/pipeline/pipeline-stack';
import ProdStack from '../lib/production/prod-stack';
import StagingStack from '../lib/staging/staging-stack';

const app = new cdk.App();
const staging = new StagingStack(app, 'StagingStack');

new PipelineStack(app, 'PipelineStack', {
  distribution: staging.distribution,
  deploy_bucket: staging.deploy_bucket,
  service: staging.service
});

// new ProdStack(app, 'ProdStack');
