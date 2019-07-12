import webpack from 'webpack';
import cf from 'aws-cloudfront-sign';

import { CF_TIMEOUT } from '../shared/constants';

import { assets, isProd, cdnDomain, domain, cfKey } from './config';

let clientAssets = false;
if (isProd) {
  const manifest = require('../dist/manifest.json'); // eslint-disable-line global-require,import/no-unresolved
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
export const applyWebpackMiddleware = app => {
  const webpackConfig = require('../webpack.config');
  const devMiddleware = require('webpack-dev-middleware');
  const hotMiddleware = require('webpack-hot-middleware');
  /* eslint-enable import/no-extraneous-dependencies,global-require */
  function reporter(middlewareOptions, options) {
    const { log, state, stats } = options;
    if (state) {
      const displayStats = middlewareOptions.stats !== false;
      if (displayStats) {
        if (stats.hasErrors()) {
          log.error(stats.toString(middlewareOptions.stats));
        } else if (stats.hasWarnings()) {
          log.warn(stats.toString(middlewareOptions.stats));
        } else {
          log.info(stats.toString(middlewareOptions.stats));
        }
      }
      const date = new Date();
      let message = `Compiled ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      if (stats.hasErrors()) {
        message = 'Failed to compile.';
      } else if (stats.hasWarnings()) {
        message = `Compiled with warnings. ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      }
      log.info(message);
    } else {
      log.info('Compiling...');
    }
  }
  const compiler = webpack(webpackConfig);
  app.use(devMiddleware(compiler, { reporter, stats: 'none' }));
  app.use(hotMiddleware(compiler, { log: false }));
};

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
