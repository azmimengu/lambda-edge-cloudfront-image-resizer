#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {
  getConfig,
  getAppEnv,
} from '../lib/config';
import {
  AssetsBucketStack,
  FunctionArtifactsBucketStack,
} from '../lib/s3';
import { CertificateManagerStack } from '../lib/certificate-manager';
import { AssetsCloudfrontDistributionStack } from '../lib/cloudfront';

const app = new cdk.App();
const appEnv = getAppEnv();
const conf = getConfig(app, appEnv);

const frankfurtEnv = { account: conf.account, region: conf.frankfurtRegion };
const virginiaEnv = { account: conf.account, region: conf.virginiaRegion };

new AssetsBucketStack(app, `AssetsBucketStack-${appEnv}`, { env: frankfurtEnv });
new FunctionArtifactsBucketStack(app, 'FunctionArtifactsBucketStack', { env: virginiaEnv });

//Create certificate for both Frankfurt and N.Virgina regions
new CertificateManagerStack(app, 'CertificateManagerStack-frankfurt', { env: frankfurtEnv });
new CertificateManagerStack(app, 'CertificateManagerStack-virginia', { env: virginiaEnv });

new AssetsCloudfrontDistributionStack(app, `AssetsCloudfrontDistributionStack-${appEnv}`, { env: virginiaEnv });
