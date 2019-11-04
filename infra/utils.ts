import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';

export function getResourceName(name: string) {
  return `${pulumi.getProject()}-${pulumi.getStack()}-${name}`;
}

interface Tag {
  [name: string]: string;
}
export function getTags(tags?: Tag): aws.Tags {
  return {
    isPulumiGenerated: 'true',
    project: pulumi.getProject(),
    stack: pulumi.getStack(),
    ...tags,
  };
}
