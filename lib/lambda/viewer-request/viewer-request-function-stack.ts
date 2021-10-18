import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import { getAppEnv, getConfig } from '../../config';
import * as iam from '@aws-cdk/aws-iam';
import * as ssm from '@aws-cdk/aws-ssm';

export class ViewerRequestFunctionStack extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appEnv = getAppEnv();
    // const conf = getConfig(this, appEnv);
    const lambdaTag = process.env.TAG;

    if (!lambdaTag) {
      throw new Error('Must be supply lambda TAG variable to deploy function.');
    }
    
    const lambdaRole = new iam.Role(this, 'FunctionRole', {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      roleName: `${appEnv}-image-resizer-viewer-request-role`,
    });

    lambdaRole.assumeRolePolicy?.addStatements(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [new iam.ServicePrincipal("edgelambda.amazonaws.com")],
      actions: ["sts:AssumeRole"]
    }));

    lambdaRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      resources: ["*"],
    }));

    const functionArtifactsBucket = s3.Bucket.fromBucketAttributes(this, 'FunctionArtifactsBucket', {
      bucketArn: cdk.Fn.importValue(`FunctionArtifactsBucketArn`),
      bucketName: cdk.Fn.importValue(`FunctionArtifactsBucketName`),
    });
    
    const viewerRequestFunction = new lambda.Function(this, 'ViewerRequestFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromBucket(functionArtifactsBucket, `viewer-request-function/${lambdaTag}`),
      handler: 'index.handler',
      functionName: `${appEnv}-image-resizer-viewer-request`,
      role: lambdaRole,
      currentVersionOptions: {
        removalPolicy: cdk.RemovalPolicy.RETAIN,
      },
      description: `deployed at ${new Date()}`
    });

    const lambdaVersion = new lambda.Alias(this, 'LambdaAlias', {
      aliasName: 'sample-alias',
      version: viewerRequestFunction.currentVersion,
    });
    (lambdaVersion.node.tryFindChild('Resource') as lambda.CfnVersion).cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN;
    (lambdaVersion.node.tryFindChild('Resource') as lambda.CfnVersion).cfnOptions.updateReplacePolicy = cdk.CfnDeletionPolicy.RETAIN;

    (lambdaVersion.node.tryFindChild('Resource') as lambda.CfnAlias).cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN;
    (lambdaVersion.node.tryFindChild('Resource') as lambda.CfnAlias).cfnOptions.updateReplacePolicy = cdk.CfnDeletionPolicy.RETAIN;

    new cdk.CfnOutput(this, 'ViewerRequestFunctionArn', {
      value: viewerRequestFunction.functionArn,
      exportName: `ViewerRequestFunctionArn-${appEnv}`,
      description: 'Viewer Request Function ARN',
    });

    new cdk.CfnOutput(this, 'ViewerRequestFunctionName', {
      value: viewerRequestFunction.functionName,
      exportName: `ViewerRequestFunctionName-${appEnv}`,
      description: 'Viewer Request Function Name',
    });

    new ssm.StringParameter(this, 'ViewerRequestFunctionVersionEdgeArnParameter', {
      stringValue: viewerRequestFunction.currentVersion.edgeArn,
      parameterName: `/${appEnv}/edge-functions/viewer-request/EDGE_ARN`
    });

  }

}
