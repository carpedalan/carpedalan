import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import { getResourceName as n, getTags as t } from './utils';
interface PolicyI {
  secrets: {
    pgUserSecret: aws.secretsmanager.Secret;
    pgPasswordSecret: aws.secretsmanager.Secret;
    privateKeySecret: aws.secretsmanager.Secret;
  };
  privateBucket: aws.s3.Bucket;
}
export function getPolicies({ secrets, privateBucket }: PolicyI) {
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
        ])
        .apply(([secretArn, pgArn, pgSecretArn]) =>
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
        ])
        .apply(([secretArn, pgArn, pgSecretArn]) =>
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
            ],
            Resource: 'arn:aws:logs:*:*:*',
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
