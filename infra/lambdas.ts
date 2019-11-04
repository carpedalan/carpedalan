import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import { getResourceName as n, getTags as t } from './utils';
const { hashElement } = require('folder-hash');

interface LambdaI {
  lambdaRole: aws.iam.Role;
  vpc: awsx.ec2.Vpc;
  sg: awsx.ec2.SecurityGroup;
  postgresSg: awsx.ec2.SecurityGroup;
  privateBucket: aws.s3.Bucket;
}

export function getLambdas({
  lambdaRole,
  vpc,
  sg,
  privateBucket,
  postgresSg,
}: LambdaI) {
  const layerArchive = new pulumi.asset.FileArchive('../imageResizer/layer/');

  const depLayer = new aws.lambda.LayerVersion(n('dep-layer'), {
    compatibleRuntimes: ['nodejs8.10'],
    code: layerArchive,
    layerName: n('dep-layer'),
    // sourceCodeHash: layerHash,
  });

  const code = new pulumi.asset.FileArchive('../imageResizer/src/');

  const photoLambda = new aws.lambda.Function(n('photo-lambda'), {
    code,
    vpcConfig: {
      securityGroupIds: [sg.securityGroup.id, postgresSg.securityGroup.id],
      subnetIds: [...vpc.privateSubnetIds, ...vpc.publicSubnetIds],
    },
    memorySize: 2048,
    timeout: 45,
    handler: 'image.imageResizer',
    role: lambdaRole.arn,
    runtime: 'nodejs8.10',
    // environment: {
    //   variables: {
    //     NODE_PATH: './:/opt/node_modules',
    //   },
    // },
    // sourceCodeHash: sourceHash,
    layers: [depLayer.arn],
    description:
      'A process to create thumbnails, upload them to s3, and update the database',
  });

  const something = privateBucket.onObjectCreated(
    n('bucket-handler'),
    photoLambda,
    {
      filterPrefix: 'raw/',
    },
  );
  return { layer: depLayer };
}
