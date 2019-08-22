#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import PipelineStack from '../lib/pipeline/pipeline-stack';
import ProdStack from '../lib/production/prod-stack';
import StagingStack from '../lib/staging/staging-stack';

const app = new cdk.App();
new PipelineStack(app, 'PipelineStack');
new ProdStack(app, 'ProdStack');
new StagingStack(app, 'StagingStack');
