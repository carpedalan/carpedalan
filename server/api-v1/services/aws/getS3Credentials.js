import { bucket, awsAccessKeyId, awsSecretAccessKey } from '../../../config';

const crypto = require('crypto');

const awsS3Config = {
  bucket,
  access_key: awsAccessKeyId,
  secret_key: awsSecretAccessKey,
  region: 'us-west-2',
  acl: 'private', // to allow the uploaded file to be publicly accessible
  'x-amz-algorithm': 'AWS4-HMAC-SHA256', // algorithm used for signing the policy document
  success_action_status: '201', // to return an XML object to the browser detailing the file state
};

function createHmacDigest(key, string) {
  const hmac = crypto.createHmac('sha256', key);
  hmac.write(string);
  hmac.end();
  return hmac.read();
}
function getS3Parameters(config, filename) {
  const date = new Date().toISOString();

  // create date string for the current date
  const dateString = date.substr(0, 4) + date.substr(5, 2) + date.substr(8, 2);

  // create upload credentials
  const credential = `${config.access_key}/${dateString}/${
    config.region
  }/s3/aws4_request`;

  // create policy
  const policy = {
    expiration: new Date(new Date().getTime() + 1 * 60 * 1000).toISOString(), // to set the time after which upload will no longer be allowed using this policy
    conditions: [
      { bucket: config.bucket },
      { key: `raw/${filename}` }, // filename with which the uploaded file will be saved on s3
      { acl: config.acl },
      { success_action_status: config.success_action_status },
      ['content-length-range', 0, 10000000], // optional: to specify the minimum and maximum upload limit
      { 'x-amz-algorithm': config['x-amz-algorithm'] },
      { 'x-amz-credential': credential },
      { 'x-amz-date': `${dateString}T000000Z` },
    ],
  };

  // base64 encode policy
  const policyBase64 = Buffer.from(JSON.stringify(policy)).toString('base64');

  // create signature with policy, aws secret key & other scope information
  const dateKey = createHmacDigest(`AWS4${config.secret_key}`, dateString);
  const dateRegionKey = createHmacDigest(dateKey, config.region);
  const dateRegionServiceKey = createHmacDigest(dateRegionKey, 's3');
  const signingKey = createHmacDigest(dateRegionServiceKey, 'aws4_request');

  // sign policy document with the signing key to generate upload signature
  const xAmzSignature = createHmacDigest(signingKey, policyBase64).toString(
    'hex',
  );

  // create upload parameters
  return {
    key: `raw/${filename}`,
    acl: config.acl,
    success_action_status: config.success_action_status,
    policy: policyBase64,
    'x-amz-algorithm': config['x-amz-algorithm'],
    'x-amz-credential': credential,
    'x-amz-date': `${dateString}T000000Z`,
    'x-amz-signature': xAmzSignature,
  };
}

export default function getS3Credentials(filename) {
  const params = getS3Parameters(awsS3Config, filename);
  const result = {
    upload_url: `https://${awsS3Config.bucket}.s3.amazonaws.com`,
    params,
  };

  return result;
}
