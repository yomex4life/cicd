#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CicdStack } from '../lib/cicd-stack';
import { cicdPipeline } from '../lib/pipeline';

const app = new cdk.App();
new CicdStack(app, 'CicdStack', {});
new cicdPipeline(app, 'PipelineStack', {});