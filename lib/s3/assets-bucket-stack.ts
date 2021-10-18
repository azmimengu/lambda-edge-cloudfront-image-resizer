import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import { getAppEnv } from '../config';

export class AssetsBucketStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appEnv = getAppEnv();

    const bucket = new s3.Bucket(this, 'AssetsBucket', {
      bucketName: `${appEnv}-assets-bucket`
    });

    new cdk.CfnOutput(this, 'AssetsBucketBucketArn', {
      value: bucket.bucketArn,
      exportName: `AssetsBucketBucketArn-${appEnv}`,
      description: 'Assets Bucket ARN',
    });

    new cdk.CfnOutput(this, 'AssetsBucketName', {
      value: bucket.bucketName,
      exportName: `AssetsBucketName-${appEnv}`,
      description: 'Assets Bucket Name',
    });

    new cdk.CfnOutput(this, 'AssetsBucketRegionalDomainName', {
      value: bucket.bucketRegionalDomainName,
      exportName: 'AssetsBucketRegionalDomainName',
      description: 'Assets Bucket Regional Domain Name',
    });
    
  }
}
