import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import { getAppEnv, getConfig } from '../config';

export class FunctionArtifactsBucketStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appEnv = getAppEnv();
    const conf = getConfig(this, appEnv);

    const bucket = new s3.Bucket(this, 'FunctionArtifactsBucket', {
      bucketName: `function-artifacts-${conf.virginiaRegion}`
    });

    new cdk.CfnOutput(this, 'FunctionArtifactsBucketArn', {
      value: bucket.bucketArn,
      exportName: 'FunctionArtifactsBucketArn',
      description: 'Function Artifacts Bucket ARN',
    });

    new cdk.CfnOutput(this, 'FunctionArtifactsBucketName', {
      value: bucket.bucketName,
      exportName: 'FunctionArtifactsBucketName',
      description: 'Function Artifacts Bucket Name',
    });

    new cdk.CfnOutput(this, 'FunctionArtifactsBucketRegionalDomainName', {
      value: bucket.bucketRegionalDomainName,
      exportName: 'FunctionArtifactsBucketRegionalDomainName',
      description: 'Function Artifacts Bucket Regional Domain Name',
    });
    
  }
}
