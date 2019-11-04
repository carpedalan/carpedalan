import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';

import { getResourceName as name, getTags as t } from './utils';

import { getDomainAndSubdomain } from './certs';

interface GetBucketsI {
  domain: string;
  namespace: string;
  certificateArn: pulumi.OutputInstance<string>;
  isPrivate: boolean;
}

export function createBucket({
  isPrivate = false,
  domain,
  namespace,
  certificateArn,
}: GetBucketsI) {
  /* tslint:disable-next-line */
  function n(resource: string) {
    return name(`${namespace}-${resource}`);
  }

  const originAccessIdentity = new aws.cloudfront.OriginAccessIdentity(
    n('origin-access'),
    {
      comment: 'Origin Access Identity for private photo s3 relationship',
    },
  );

  const privateBucket = new aws.s3.Bucket(n('private-bucket'), {
    acl: 'private',
    forceDestroy: true,
    tags: t(),
  });

  new aws.s3.BucketPolicy(n('private-photo-bucket-policy'), {
    bucket: privateBucket.bucket,
    policy: pulumi.interpolate`{
      "Version": "2008-10-17",
      "Id": "PolicyForCloudFrontPrivateContent",
      "Statement": [
        {
          "Sid": "1",
          "Effect": "Allow",
          "Principal": {
              "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${originAccessIdentity.id}"
          },
          "Action": "s3:GetObject",
          "Resource": "arn:aws:s3:::${privateBucket.bucket}/*"
        }
      ]
    }`,
  });

  const s3OriginId = 'S3PhotoOrigin';
  const s3Distribution = new aws.cloudfront.Distribution(n('private-distro'), {
    aliases: [domain],
    comment: 'Some comment',
    tags: t(),
    defaultCacheBehavior: {
      allowedMethods: [
        'DELETE',
        'GET',
        'HEAD',
        'OPTIONS',
        'PATCH',
        'POST',
        'PUT',
      ],
      cachedMethods: ['GET', 'HEAD'],
      defaultTtl: 3600,
      forwardedValues: {
        cookies: {
          forward: 'none',
        },
        queryString: false,
      },
      maxTtl: 86400,
      minTtl: 0,
      targetOriginId: s3OriginId,
      viewerProtocolPolicy: 'allow-all',
    },
    defaultRootObject: 'index.html',
    enabled: true,
    isIpv6Enabled: true,
    orderedCacheBehaviors: [
      {
        allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
        cachedMethods: ['GET', 'HEAD'],
        compress: true,
        defaultTtl: 3600,
        forwardedValues: {
          cookies: {
            forward: 'none',
          },
          queryString: false,
        },
        maxTtl: 86400,
        minTtl: 0,
        pathPattern: '/*',
        targetOriginId: s3OriginId,
        viewerProtocolPolicy: 'redirect-to-https',
        ...(isPrivate ? { trustedSigners: ['self'] } : {}),
      },
    ],
    origins: [
      {
        domainName: privateBucket.bucketRegionalDomainName,
        originId: s3OriginId,
        s3OriginConfig: {
          originAccessIdentity:
            originAccessIdentity.cloudfrontAccessIdentityPath,
        },
      },
    ],
    priceClass: 'PriceClass_200',
    restrictions: {
      geoRestriction: {
        restrictionType: 'none',
      },
    },
    viewerCertificate: {
      acmCertificateArn: certificateArn,
      sslSupportMethod: 'sni-only',
    },
  });
  // Creates a new Route53 DNS record pointing the domain to the CloudFront distribution.
  function createAliasRecord(
    domain: string,
    distribution: aws.cloudfront.Distribution,
  ): aws.route53.Record {
    const domainParts = getDomainAndSubdomain('pulumi.dalan.dev');
    pulumi.log.debug(JSON.stringify(domainParts));
    const hostedZone = aws.route53.getZone({ name: domainParts.parentDomain });
    return new aws.route53.Record(domain, {
      name: domain,
      zoneId: hostedZone.zoneId,
      type: 'A',
      aliases: [
        {
          name: distribution.domainName,
          zoneId: distribution.hostedZoneId,
          evaluateTargetHealth: true,
        },
      ],
    });
  }

  const aRecord = createAliasRecord(domain, s3Distribution);
  return {
    aRecord,
    bucket: privateBucket,
  };
}
