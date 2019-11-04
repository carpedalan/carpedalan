import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';

import { getResourceName as n, getTags as t } from './utils';

interface MakeDBI {
  vpc: awsx.ec2.Vpc;
  postgresSg: awsx.ec2.SecurityGroup;
  config: pulumi.Config;
}

export function makeDB({ vpc, postgresSg, config }: MakeDBI) {
  const username = config.getSecret('pg_user');
  const password = config.getSecret('pg_password');
  const subnetGroup = new aws.rds.SubnetGroup(n('pulumisubnet'), {
    subnetIds: vpc.privateSubnetIds,
    tags: t(),
  });

  const rds = new aws.rds.Instance(n('rds'), {
    username,
    password,
    allowMajorVersionUpgrade: true,
    instanceClass: 'db.t2.micro',
    applyImmediately: true,
    availabilityZone: vpc.privateSubnets[0].subnet.availabilityZone,
    dbSubnetGroupName: subnetGroup.name,
    vpcSecurityGroupIds: [postgresSg.id],
    engine: 'postgres',
    name: 'carpedalan',
    port: 5432,
    publiclyAccessible: false,
    allocatedStorage: 20,
    skipFinalSnapshot: true,
    tags: t(),
  });

  return { rds };
}
