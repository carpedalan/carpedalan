# carpedalan
[![CircleCI](https://circleci.com/gh/carpedalan/carpedalan/tree/master.svg?style=shield)](https://circleci.com/gh/carpedalan/carpedalan/tree/master)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![codecov](https://codecov.io/gh/carpedalan/carpedalan/branch/master/graph/badge.svg)](https://codecov.io/gh/carpedalan/carpedalan)

## A webapp for the Dalan family

This monorepo has a lot of stuff. I use this project as a means to try out new technologies and tools. I work on it in my spare time, and it is bound to have abandoned files, config stuff, etc., because hey YOLO or something.

# Setting up
Okay so there's a few things.

1. You'll need to have `mkcert` installed. https://github.com/FiloSottile/mkcert, and have run `mkcert -install` to install the local certificate authority. This repo needs to run with TLS so that cookies work with cloudfront locally. 

2. You'll also need `aws-cli` installed. [Install AWS](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html). This is used to sync environment variables that some scripts use.

3. Next, get AWS creds from me. Ask me for dev creds. Then add the `carpedev` identity to your credentials file (`~/.aws/credentials`)
```
[carpedev]
region = us-west-2
aws_access_key_id = <ID HERE>
aws_secret_access_key = <KEY HERE>
```

Then run 
```
sudo yarn setup
```
For reference, this creates a certificate with your machine as the certificate authority, syncs environment files with the AWS CLI, and adds a host entry of `local.carpedalan.com` to your `/etc/hosts` file (that's what the `sudo` is for).

## Running locally
Just run:
```
yarn du
```
And visit [https://local.carpedalan.com](https://local.carpedalan.com).