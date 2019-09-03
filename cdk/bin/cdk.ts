#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import PipelineStack from '../lib/pipeline/pipeline-stack';
import ProdStack from '../lib/production/prod-stack';
import StagingStack from '../lib/staging/staging-stack';
import SecretsStack from '../lib/staging/secrets-stack';

const app = new cdk.App();
const secrets = new SecretsStack(app, 'SecretsStack');

const staging = new StagingStack(app, 'StagingStack', { staging_secret: secrets.staging_secret });

new PipelineStack(app, 'PipelineStack', {
  distribution: staging.distribution,
  deploy_bucket: staging.deploy_bucket,
  service: staging.service,
  api_url: staging.api_url,
  staging_secret: secrets.staging_secret,
  client_id: staging.client_id,
  user_pool_id: staging.user_pool_id
});

// new ProdStack(app, 'ProdStack');
