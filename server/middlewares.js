import cf from 'aws-cloudfront-sign';

import { CF_TIMEOUT } from '../shared/constants';

import { assets, isProd, cdnDomain, domain, cfKey } from './config';

let clientAssets = false;
if (isProd) {
  const manifest = require('./manifest.json'); // eslint-disable-line global-require,import/no-unresolved
  clientAssets = assets.map(asset => manifest[asset]);
}

export function setSignedCloudfrontCookie(res) {
  const options = {
    keypairId: cfKey,
    privateKeyPath: `/app/server/cfkeys/pk-${cfKey}.pem`,
    expireTime: new Date().getTime() + CF_TIMEOUT,
  };
  const signedCookies = cf.getSignedCookies(`https://${cdnDomain}/*`, options);

  if (Object.keys(signedCookies).length) {
    Object.keys(signedCookies).forEach(key => {
      res.cookie(key, signedCookies[key], {
        domain: `.${domain}`,
        path: '/',
        // secure: true,
        http: true,
        maxAge: CF_TIMEOUT,
      });
    });
  }
}

/* eslint-disable import/no-extraneous-dependencies,global-require, import/prefer-default-export */

export const isAdmin = (req, res, next) => {
  if (req.session.user !== 'write') {
    res.status(401).send();
  } else {
    req.session.requests = req.session.requests + 1; // eslint-disable-line operator-assignment
    setSignedCloudfrontCookie(res);
    next();
  }
};

export const isLoggedIn = (req, res, next) => {
  if (!['read', 'write'].includes(req.session.user)) {
    res.status(401).render('index', {
      layout: false,
      session: JSON.stringify(req.session),
      clientAssets,
      meta: {},
      isProd,
    });
  } else {
    req.session.requests = req.session.requests + 1; // eslint-disable-line operator-assignment
    setSignedCloudfrontCookie(res);
    next();
  }
};
