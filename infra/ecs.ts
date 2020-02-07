import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import { getResourceName as n, getTags as t } from './utils';

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  S3_ASSETS_BUCKET,
  CIRCLE_SHA1,
  ASSET_CDN_DOMAIN,
  CI_JOB_ID,
  CI_COMMIT_SHA,
  CI_COMMIT_REF_NAME,
} = process.env;
interface CreateI {
  vpc: awsx.ec2.Vpc;
  albCertificateArn: pulumi.OutputInstance<string>;
  sg: awsx.ec2.SecurityGroup;
  postgresSg: awsx.ec2.SecurityGroup;
  rds: aws.rds.Instance;
  config: pulumi.Config;
  taskRole: aws.iam.Role;
  executionRole: aws.iam.Role;
  targetDomain: string;
  publicDistroDomain: string;
  privateDistroDomain: string;
  secrets: {
    pgUserSecret: aws.secretsmanager.Secret;
    pgPasswordSecret: aws.secretsmanager.Secret;
    privateKeySecret: aws.secretsmanager.Secret;
    adminPassword: aws.secretsmanager.Secret;
    publicPassword: aws.secretsmanager.Secret;
    sessionSecret: aws.secretsmanager.Secret;
    cfKeySecret: aws.secretsmanager.Secret;
  };
  aRecord: aws.route53.Record;
  publicBucket: aws.s3.Bucket;
  bucketUserCreds: aws.iam.AccessKey;
}

export function createECSResources({
  vpc,
  albCertificateArn,
  sg,
  postgresSg,
  rds,
  taskRole,
  executionRole,
  secrets,
  targetDomain,
  publicDistroDomain,
  privateDistroDomain,
  publicBucket,
  bucketUserCreds,
}: CreateI) {
  const alb = new awsx.lb.ApplicationLoadBalancer(n('alb'), {
    vpc,
    securityGroups: [sg],
    external: true,
    tags: t(),
  });

  const targetGroup = alb.createTargetGroup(n('webapp'), {
    vpc,
    port: 80,
    healthCheck: {
      path: '/healthcheck',
      timeout: 5,
    },
    tags: t(),
  });

  const listener = targetGroup.createListener(n('listener'), {
    vpc,
    port: 443,
    certificateArn: albCertificateArn, // @TODO MAKE NEW CERT
  });

  alb.createListener(n('redirecthttp'), {
    port: 80,
    protocol: 'HTTP',
    defaultAction: {
      type: 'redirect',
      redirect: {
        protocol: 'HTTPS',
        port: '443',
        statusCode: 'HTTP_301',
      },
    },
  });

  const cluster = new awsx.ecs.Cluster(n('cluster'), {
    vpc,
    tags: t(),
    securityGroups: [sg, postgresSg],
  });

  cluster.createAutoScalingGroup(n('auto-scaling-group'), {
    templateParameters: { minSize: 2 },
    launchConfigurationArgs: { instanceType: 't2.nano' },
  });

  const env = [
    {
      name: 'PG_HOST',
      value: pulumi.interpolate`${rds.address}`,
    },
    {
      name: 'PG_PORT',
      value: pulumi.interpolate`${rds.port}`,
    },
    {
      name: 'PG_DATABASE',
      value: pulumi.interpolate`${rds.name}`,
    },
    {
      name: 'ASSET_CDN_DOMAIN',
      value: publicDistroDomain,
    },
    {
      name: 'CDN_DOMAIN',
      value: privateDistroDomain,
    },
    {
      name: 'DOMAIN',
      value: pulumi.interpolate`${targetDomain}`,
    },
    {
      name: 'PORT',
      value: pulumi.interpolate`${targetGroup.targetGroup.port}`,
    },
    {
      name: 'AWS_ACCESS_KEY_ID',
      value: pulumi.interpolate`${bucketUserCreds.id}`,
    },
    {
      name: 'AWS_SECRET_ACCESS_KEY',
      value: pulumi.interpolate`${bucketUserCreds.secret}`,
    },
    {
      name: 'CI_JOB_ID',
      value: CI_JOB_ID,
    },
    {
      name: 'CI_COMMIT_SHA',
      value: CI_COMMIT_SHA,
    },
    {
      name: 'CI_COMMIT_REF_NAME',
      value: CI_COMMIT_REF_NAME,
    },
  ];

  const repository = new aws.ecr.Repository(n('repository'));

  const taskDefinition = new awsx.ecs.EC2TaskDefinition(n('task'), {
    executionRole,
    taskRole,
    tags: t(),
    // @ts-ignore
    containers: {
      web: {
        image: awsx.ecs.Image.fromDockerBuild(repository, {
          context: '../',
          dockerfile: '../server/Dockerfile',
          extraOptions: ['--target', 'prod', '--cache-from', 'api:latest'],
        }),
        memory: 256,
        portMappings: [listener],
        environment: env,
        secrets: [
          {
            name: 'PRIVATE_KEY',
            valueFrom: pulumi.interpolate`${secrets.privateKeySecret.arn}`,
          },
          {
            name: 'PG_USER',
            valueFrom: pulumi.interpolate`${secrets.pgUserSecret.arn}`,
          },
          {
            // @ts-ignore
            name: 'PG_PASSWORD',
            // @ts-ignore
            valueFrom: pulumi.interpolate`${secrets.pgPasswordSecret.arn}`,
          },
          {
            name: 'ADMIN_PASSWORD',
            valueFrom: pulumi.interpolate`${secrets.adminPassword.arn}`,
          },
          {
            // @ts-ignore
            name: 'PUBLIC_PASSWORD',
            // @ts-ignore
            valueFrom: pulumi.interpolate`${secrets.publicPassword.arn}`,
          },
          {
            // @ts-ignore
            name: 'SESSION_SECRET',
            // @ts-ignore
            valueFrom: pulumi.interpolate`${secrets.sessionSecret.arn}`,
          },
          {
            // @ts-ignore
            name: 'CLOUDFRONT_KEY_ID',
            // @ts-ignore
            valueFrom: pulumi.interpolate`${secrets.cfKeySecret.arn}`,
          },
        ],
      },
    },
  });

  const service = new awsx.ecs.EC2Service(n('service'), {
    cluster,
    taskDefinition,
    desiredCount: 1,
    waitForSteadyState: false,
    tags: t(),
  });

  return { alb, taskDefinition };
}
