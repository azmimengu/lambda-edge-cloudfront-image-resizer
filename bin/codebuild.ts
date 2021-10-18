#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {
  getConfig,
  getAppEnv,
} from '../lib/config';
import {
  ViewerRequestFunctionCodebuildStack,
  OriginResponseFunctionCodebuildStack
} from '../lib/lambda';

const app = new cdk.App();
const appEnv = getAppEnv();
const conf = getConfig(app, appEnv);

const virginiaEnv = { account: conf.account, region: conf.virginiaRegion };

new ViewerRequestFunctionCodebuildStack(app, 'ViewerRequestFunctionCodebuildStack', { env: virginiaEnv });
new OriginResponseFunctionCodebuildStack(app, 'OriginResponseFunctionCodebuildStack', { env: virginiaEnv });
