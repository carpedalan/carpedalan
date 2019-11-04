const cf = require('aws-cloudfront-sign');

const CF_TIMEOUT = 1000 * 45;
const cfKey = 'APKAJ3ZFDYUCI2XSL4KQ';
const options = {
  keypairId: cfKey,
  privateKeyPath: `./server/cfkeys/pk-${cfKey}.pem`,
  expireTime: new Date().getTime() + CF_TIMEOUT,
};

const signedUrl = cf.getSignedUrl(
  'https://photos.pulumi.dalan.dev/index.html',
  options,
);

console.log('signed', signedUrl);
