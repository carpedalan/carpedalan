import cf from 'aws-cloudfront-sign';

import { AWSError } from '../../errors';
import { CF_TIMEOUT } from '../../../shared/constants';
import { cdnDomain, cfKey, domain } from '../../config';

export default function setSignedCloudfrontCookie(res) {
  try {
    const options = {
      keypairId: cfKey,
      privateKeyPath: `/app/server/cfkeys/pk-${cfKey}.pem`,
      expireTime: new Date().getTime() + CF_TIMEOUT,
    };
    const signedCookies = cf.getSignedCookies(
      `https://${cdnDomain}/*`,
      options,
    );
    if (Object.keys(signedCookies).length) {
      Object.keys(signedCookies).forEach(key => {
        res.cookie(key, signedCookies[key], {
          domain: `.${domain}`,
          path: '/',
          // secure: true,
          http: true,
          // maxAge: 1000 * 5,
        });
      });
    }
  } catch (e) {
    throw new AWSError(e);
  }
}
