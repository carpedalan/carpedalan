#!/usr/bin/env node

const fs = require('fs');

const {
  CIRCLE_SHA1,
  CIRCLE_BRANCH,
  PROD_ECR_REPOSITORY,
  STAGE_ECR_REPOSITORY,
  STAGE_ECS_CLUSTER,
  PROD_ECS_CLUSTER,
} = process.env;
let ECR_REPOSITORY = STAGE_ECR_REPOSITORY;
let ECS_CLUSTER = STAGE_ECS_CLUSTER;
if (CIRCLE_BRANCH === 'master') {
  ECR_REPOSITORY = PROD_ECR_REPOSITORY;
  ECS_CLUSTER = PROD_ECS_CLUSTER;
}
const json = {
  containerDefinitions: [
    {
      logConfiguration: {
        logDriver: 'awslogs',
        options: {
          'awslogs-group': `/ecs/${ECS_CLUSTER}`,
          'awslogs-region': 'us-west-2',
          'awslogs-stream-prefix': 'ecs',
        },
      },
      image: `${ECR_REPOSITORY}:${CIRCLE_SHA1}`,
      name: ECS_CLUSTER,
      portMappings: [
        {
          hostPort: 80,
          protocol: 'tcp',
          containerPort: 80,
        },
        {
          hostPort: 3000,
          protocol: 'tcp',
          containerPort: 3000,
        },
        {
          hostPort: 514,
          protocol: 'tcp',
          containerPort: 514,
        },
        {
          hostPort: 6514,
          protocol: 'tcp',
          containerPort: 6514,
        },
      ],
    },
  ],
  memory: '512',
  cpu: '512',
  family: ECS_CLUSTER,
  networkMode: 'awsvpc',
  volumes: [],
  requiresCompatibilities: ['EC2'],
  // todo make this a var
  taskRoleArn: 'arn:aws:iam::404112572358:role/ecs-ec2-ses',
};

fs.writeFileSync('container-definition.json', JSON.stringify(json), 'utf8');
