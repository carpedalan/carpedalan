import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import { getResourceName as n, getTags as t } from './utils';

interface SecretsI {
  config: pulumi.Config;
}

export function getSecrets({ config }: SecretsI) {
  const username = config.getSecret('pg_user');
  const password = config.getSecret('pg_password');
  const privateKey = config.getSecret('privateKey');
  const adminPass = config.getSecret('adminPassword');
  const publicPass = config.getSecret('publicPassword');
  const session = config.getSecret('sessionSecret');

  const privateKeySecret = new aws.secretsmanager.Secret(n('private-key'), {
    tags: t(),
  });

  const adminPassword = new aws.secretsmanager.Secret(n('adminPassword'), {
    tags: t(),
  });

  const publicPassword = new aws.secretsmanager.Secret(n('publicPassword'), {
    tags: t(),
  });

  const sessionSecret = new aws.secretsmanager.Secret(n('sessionSecret'), {
    tags: t(),
  });

  const pgUserSecret = new aws.secretsmanager.Secret(n('pg-user'), {
    tags: t(),
  });
  const pgPasswordSecret = new aws.secretsmanager.Secret(n('pg-password'), {
    tags: t(),
  });
  let secretVersion;

  if (privateKey) {
    secretVersion = new aws.secretsmanager.SecretVersion(n('private-key'), {
      secretId: privateKeySecret.id,
      secretString: privateKey,
    });
    new aws.secretsmanager.SecretVersion(n('pg-user'), {
      secretId: pgUserSecret.id,
      secretString: username,
    });
    new aws.secretsmanager.SecretVersion(n('pg-password'), {
      secretId: pgPasswordSecret.id,
      secretString: password,
    });
    new aws.secretsmanager.SecretVersion(n('adminPassword'), {
      secretId: adminPassword.id,
      secretString: adminPass,
    });
    new aws.secretsmanager.SecretVersion(n('publicPassword'), {
      secretId: publicPassword.id,
      secretString: publicPass,
    });
    new aws.secretsmanager.SecretVersion(n('sessionSecret'), {
      secretId: sessionSecret.id,
      secretString: session,
    });
  }

  return {
    secrets: {
      pgPasswordSecret,
      pgUserSecret,
      privateKeySecret,
      adminPassword,
      publicPassword,
      sessionSecret,
    },
  };
}
