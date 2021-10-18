# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template


### Certificate Manager Stack (Frankfurt)
* `cdk synth --app "npx ts-node bin/common.ts" CertificateManagerStack-frankfurt`
* `cdk deploy --app "npx ts-node bin/common.ts" CertificateManagerStack-frankfurt`

### Certificate Manager Stack (Virginia)
* `cdk synth --app "npx ts-node bin/common.ts" CertificateManagerStack-virginia`
* `cdk deploy --app "npx ts-node bin/common.ts" CertificateManagerStack-virginia`

### S3 Function Artifacts Bucket Deployment (Virginia)
* `cdk synth --app "npx ts-node bin/common.ts" FunctionArtifactsBucketStack`
* `cdk deploy --app "npx ts-node bin/common.ts" FunctionArtifactsBucketStack`

### S3 Assets Bucket Deployment
* `cdk synth --app "npx ts-node bin/common.ts" AssetsBucketStack-dev`
* `cdk deploy --app "npx ts-node bin/common.ts" AssetsBucketStack-dev`

### Viewer Request @Edge Function Codebuild Deployment (Virginia)
* `cdk synth --app "npx ts-node bin/codebuild.ts" ViewerRequestFunctionCodebuildStack`
* `cdk deploy --app "npx ts-node bin/codebuild.ts" ViewerRequestFunctionCodebuildStack`

### Origin Response @Edge Function Codebuild Deployment (Virginia)
* `cdk synth --app "npx ts-node bin/codebuild.ts" OriginResponseFunctionCodebuildStack`
* `cdk deploy --app "npx ts-node bin/codebuild.ts" OriginResponseFunctionCodebuildStack`

### Viewer Request Lambda @Edge Function Deployment
* `TAG=1.0.13 cdk synth --app "npx ts-node bin/function.ts" ViewerRequestFunctionStack-dev`
* `TAG=1.0.13 cdk deploy --app "npx ts-node bin/function.ts" ViewerRequestFunctionStack-dev`

### Origin Response Lambda @Edge Function Deployment
* `TAG=1.0.15 cdk synth --app "npx ts-node bin/function.ts" OriginResponseFunctionStack-dev`
* `TAG=1.0.15 cdk deploy --app "npx ts-node bin/function.ts" OriginResponseFunctionStack-dev`

### CloudFront Distribution Stack Deployment
* `cdk synth --app "npx ts-node bin/common.ts" AssetsCloudfrontDistributionStack-dev`
* `cdk deploy --app "npx ts-node bin/common.ts" AssetsCloudfrontDistributionStack-dev`


### Start build via Codebuild
aws codebuild start-build --project-name origin-response-lambda --environment-variables-override "[{\"name\":\"LAMBDA_VERSION\",\"value\":\"1.0.15\"}]" --source-version origin-response-impl --region us-east-1
aws codebuild start-build --project-name viewer-request-lambda --environment-variables-override "[{\"name\":\"LAMBDA_VERSION\",\"value\":\"1.0.13\"}]" --source-version origin-response-impl --region us-east-1
