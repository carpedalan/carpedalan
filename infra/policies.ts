import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import { getResourceName as n, getTags as t } from './utils';
interface PolicyI {
  secrets: {
    pgUserSecret: aws.secretsmanager.Secret;
    pgPasswordSecret: aws.secretsmanager.Secret;
    privateKeySecret: aws.secretsmanager.Secret;
    adminPassword: aws.secretsmanager.Secret;
    publicPassword: aws.secretsmanager.Secret;
    sessionSecret: aws.secretsmanager.Secret;
  };
  rds: aws.rds.Instance;
  privateBucket: aws.s3.Bucket;
}
export function getPolicies({ secrets, privateBucket, rds }: PolicyI) {
  const taskRole = new aws.iam.Role(n('task-role'), {
    assumeRolePolicy: JSON.stringify(
      awsx.ecs.TaskDefinition.defaultRoleAssumeRolePolicy(),
    ),
    tags: t(),
  });

  const executionRole = new aws.iam.Role(n('execution-role'), {
    assumeRolePolicy: JSON.stringify(
      awsx.ecs.TaskDefinition.defaultRoleAssumeRolePolicy(),
    ),
    tags: t(),
  });

  new aws.iam.RolePolicy(
    n('task-role-policy'),
    {
      role: taskRole,
      policy: pulumi
        .all([
          secrets.privateKeySecret.arn,
          secrets.pgUserSecret.arn,
          secrets.pgPasswordSecret.arn,
          secrets.adminPassword.arn,
          secrets.publicPassword.arn,
          secrets.sessionSecret.arn,
          rds.arn,
        ])
        .apply(
          ([
            secretArn,
            pgArn,
            pgSecretArn,
            admin,
            publicPass,
            session,
            rdsArn,
          ]) =>
            JSON.stringify({
              Version: '2012-10-17',
              Statement: [
                {
                  Effect: 'Allow',
                  Action: [
                    'ssm:GetParameters',
                    'secretsmanager:GetSecretValue',
                    'kms:Decrypt',
                  ],
                  Resource: [
                    secretArn,
                    pgArn,
                    pgSecretArn,
                    admin,
                    publicPass,
                    session,
                    // key id?
                  ],
                },
                {
                  Effect: 'Allow',
                  Action: [
                    'cloudformation:DescribeChangeSet',
                    'cloudformation:DescribeStackResources',
                    'cloudformation:DescribeStacks',
                    'cloudformation:GetTemplate',
                    'cloudformation:ListStackResources',
                    'cloudwatch:*',
                    'cognito-identity:ListIdentityPools',
                    'cognito-sync:GetCognitoEvents',
                    'cognito-sync:SetCognitoEvents',
                    'dynamodb:*',
                    'ec2:DescribeSecurityGroups',
                    'ec2:DescribeSubnets',
                    'ec2:DescribeVpcs',
                    'events:*',
                    'iam:GetPolicy',
                    'iam:GetPolicyVersion',
                    'iam:GetRole',
                    'iam:GetRolePolicy',
                    'iam:ListAttachedRolePolicies',
                    'iam:ListRolePolicies',
                    'iam:ListRoles',
                    'iam:PassRole',
                    'iot:AttachPrincipalPolicy',
                    'iot:AttachThingPrincipal',
                    'iot:CreateKeysAndCertificate',
                    'iot:CreatePolicy',
                    'iot:CreateThing',
                    'iot:CreateTopicRule',
                    'iot:DescribeEndpoint',
                    'iot:GetTopicRule',
                    'iot:ListPolicies',
                    'iot:ListThings',
                    'iot:ListTopicRules',
                    'iot:ReplaceTopicRule',
                    'kinesis:DescribeStream',
                    'kinesis:ListStreams',
                    'kinesis:PutRecord',
                    'kms:ListAliases',
                    'lambda:*',
                    'logs:*',
                    's3:*',
                    'sns:ListSubscriptions',
                    'sns:ListSubscriptionsByTopic',
                    'sns:ListTopics',
                    'sns:Publish',
                    'sns:Subscribe',
                    'sns:Unsubscribe',
                    'sqs:ListQueues',
                    'sqs:SendMessage',
                    'tag:GetResources',
                    'xray:PutTelemetryRecords',
                    'xray:PutTraceSegments',
                  ],
                  Resource: '*',
                },
                {
                  Effect: 'Allow',
                  Action: ['rds-db:connect'],
                  Resource: [rdsArn],
                },
              ],
            }),
        ),
    },
    { dependsOn: secrets.privateKeySecret },
  );

  new aws.iam.RolePolicy(
    n('execute-role-policy'),
    {
      role: executionRole,
      policy: pulumi
        .all([
          secrets.privateKeySecret.arn,
          secrets.pgUserSecret.arn,
          secrets.pgPasswordSecret.arn,
          secrets.adminPassword.arn,
          secrets.publicPassword.arn,
          secrets.sessionSecret.arn,
          rds.arn,
        ])
        .apply(
          ([
            secretArn,
            pgArn,
            pgSecretArn,
            admin,
            publicPass,
            session,
            rdsArn,
          ]) =>
            JSON.stringify({
              Version: '2012-10-17',
              Statement: [
                {
                  Effect: 'Allow',
                  Action: [
                    'ssm:GetParameters',
                    'secretsmanager:GetSecretValue',
                    'kms:Decrypt',
                  ],
                  Resource: [
                    secretArn,
                    pgArn,
                    pgSecretArn,
                    admin,
                    publicPass,
                    session,
                    // key id?
                  ],
                },
                {
                  Effect: 'Allow',
                  Action: [
                    'ecr:GetAuthorizationToken',
                    'ecr:BatchCheckLayerAvailability',
                    'ecr:GetDownloadUrlForLayer',
                    'ecr:BatchGetImage',
                    'logs:CreateLogStream',
                    'logs:PutLogEvents',
                  ],
                  Resource: '*',
                },
                {
                  Effect: 'Allow',
                  Action: ['rds-db:connect'],
                  Resource: [rdsArn],
                },
              ],
            }),
        ),
    },
    { dependsOn: secrets.privateKeySecret },
  );

  const lambdaRole = new aws.iam.Role(n('lambda-role'), {
    assumeRolePolicy: `{
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Principal": {
            "Service": "lambda.amazonaws.com"
          },
          "Action": "sts:AssumeRole"
        }
      ]
    }`,
    tags: t(),
  });

  new aws.iam.RolePolicy(n('lambda-role-policy'), {
    role: lambdaRole,
    policy: pulumi.all([privateBucket.arn]).apply(([bucketArn]) =>
      JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Action: [
              'logs:CreateLogGroup',
              'logs:CreateLogStream',
              'logs:PutLogEvents',
              'ec2:*',
            ],
            Resource: 'arn:aws:logs:*:*:*',
          },
          {
            Effect: 'Allow',
            Action: [
              'ec2:CreateNetworkInterface',
              'ec2:DescribeNetworkInterfaces',
              'ec2:DeleteNetworkInterface',
            ],

            Resource: '*',
          },
          {
            Effect: 'Allow',
            Action: ['s3:GetBucketLocation', 's3:ListAllMyBuckets'],
            Resource: 'arn:aws:s3:::*',
          },
          {
            Effect: 'Allow',
            Action: 's3:*',
            Resource: [bucketArn, `${bucketArn}/*`],
          },
        ],
      }),
    ),
  });
  return { taskRole, executionRole, lambdaRole };
}
