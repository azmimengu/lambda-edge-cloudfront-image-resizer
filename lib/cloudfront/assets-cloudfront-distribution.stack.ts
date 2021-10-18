import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as route53 from '@aws-cdk/aws-route53';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as route53targets from '@aws-cdk/aws-route53-targets';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as lambda from '@aws-cdk/aws-lambda';
import * as ssm from '@aws-cdk/aws-ssm';

import { getAppEnv, getConfig } from '../config';

export class AssetsCloudfrontDistributionStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appEnv = getAppEnv();
    const conf = getConfig(this, appEnv);

    const assetsBucket = s3.Bucket.fromBucketAttributes(this, 'AssetsBucket', {
      bucketArn: conf.assetsBucket.arn,
      bucketName: conf.assetsBucket.name,
      region: conf.assetsBucket.region,
      bucketRegionalDomainName: conf.assetsBucket.regionalDomainName,
    });

    const cert = acm.Certificate.fromCertificateArn(this, 'AzmiMenguCert', cdk.Fn.importValue('CertificateArn'));

    const recordName = appEnv == 'prod' ? 'cdn' : `${appEnv}-cdn`;
    const cdnAlias = appEnv == 'prod' ? 'cdn.azmimengu.com' : `${appEnv}-cdn.azmimengu.com`;

    const viewerRequestLambdaEdgeVersionArn = ssm.StringParameter.fromStringParameterName(this, 'ViewerRequestFunctionVersionEdgeArnParameter', `/${appEnv}/edge-functions/viewer-request/EDGE_ARN`).stringValue;
    const originResponseLambdaEdgeVersionArn = ssm.StringParameter.fromStringParameterName(this, 'OriginResponseFunctionVersionEdgeArnParameter', `/${appEnv}/edge-functions/origin-response/EDGE_ARN`).stringValue;

    const viewerRequestLambdaEdgeVersion = lambda.Version.fromVersionArn(this, 'ViewerRequestLambdaEdgeVersion', viewerRequestLambdaEdgeVersionArn);
    const originResponseLambdaEdgeVersion = lambda.Version.fromVersionArn(this, 'OriginResponseLambdaEdgeVersion', originResponseLambdaEdgeVersionArn);

    const distribution = new cloudfront.Distribution(this, 'AssetsDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(assetsBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        edgeLambdas: [
          {
            functionVersion: viewerRequestLambdaEdgeVersion,
            eventType: cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
          },
          {
            functionVersion: originResponseLambdaEdgeVersion,
            eventType: cloudfront.LambdaEdgeEventType.ORIGIN_RESPONSE
          }
        ]
      },
      domainNames: [cdnAlias],
      certificate: cert,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
      comment: 'cdn azmimengu',
    });

    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: 'azmimengu.com',
    });

    const distributionRecord = route53.RecordTarget.fromAlias(new route53targets.CloudFrontTarget(distribution));
    
    new route53.ARecord(this, 'CdnRecord', {
      zone: hostedZone,
      target: distributionRecord,
      recordName: recordName,
      comment: `${recordName} distribution record`
    });

  }
}
