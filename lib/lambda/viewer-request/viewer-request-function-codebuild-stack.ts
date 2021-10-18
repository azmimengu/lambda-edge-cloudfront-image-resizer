import * as cdk from '@aws-cdk/core';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as s3 from '@aws-cdk/aws-s3';
import { getAppEnv } from '../../config';

export class ViewerRequestFunctionCodebuildStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appEnv = getAppEnv();

    const bucket = s3.Bucket.fromBucketAttributes(this, 'FunctionsBucket', {
      bucketArn: cdk.Fn.importValue('FunctionArtifactsBucketArn'),
      bucketName: cdk.Fn.importValue('FunctionArtifactsBucketName')
    });

    const project = new codebuild.Project(this, 'ViewerRequestLambdaCodebuildProject', {
      projectName: 'viewer-request-lambda',
      source: codebuild.Source.gitHub({
        owner: 'azmimengu',
        repo: 'lambda-edge-cloudfront-image-resizer',
        branchOrRef: 'main',
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          pre_build: {
            commands: [
              'echo "Changing working directory"',
              'cd lib/lambda/viewer-request/function',
              'echo "Installing package dependencies..."',
              'npm install'
            ]
          },
          build: {
            commands: [
              'echo "Build started"',
              'npm run build',
              'rm -rf node_modules/typescript',
              'cp -R node_modules/ build/'
            ],
          },
        },
        artifacts: {
          'base-directory': 'lib/lambda/viewer-request/function/build',
          files: [
            '**/*'
          ],
          name: '$LAMBDA_VERSION'
        }
      }),
      artifacts: codebuild.Artifacts.s3({
        bucket,
        includeBuildId: false,
        packageZip: true,
        path: 'viewer-request-function',
      }),
    });

  }
}
