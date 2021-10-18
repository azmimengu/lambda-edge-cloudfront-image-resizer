#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {
  getConfig,
  getAppEnv,
} from '../lib/config';
import {
  ViewerRequestFunctionStack,
  OriginResponseFunctionStack
} from '../lib/lambda';

const app = new cdk.App();
const appEnv = getAppEnv();
const conf = getConfig(app, appEnv);

const virginiaEnv = { account: conf.account, region: conf.virginiaRegion };

new ViewerRequestFunctionStack(app, `ViewerRequestFunctionStack-${appEnv}`, { env: virginiaEnv });
new OriginResponseFunctionStack(app, `OriginResponseFunctionStack-${appEnv}`, { env: virginiaEnv });
