import * as cdk from '@aws-cdk/core';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as route53 from '@aws-cdk/aws-route53';

export class CertificateManagerStack extends cdk.Stack {

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: 'azmimengu.com',
    });

    const cert = new acm.Certificate(this, 'Certificate', {
      domainName: '*.azmimengu.com',
      subjectAlternativeNames: ['azmimengu.com'],
      validation: acm.CertificateValidation.fromDns(),
    });

    new cdk.CfnOutput(this, 'CertificateArn', {
      value: cert.certificateArn,
      exportName: 'CertificateArn',
      description: 'Certificate Arn'
    });

  }
}
