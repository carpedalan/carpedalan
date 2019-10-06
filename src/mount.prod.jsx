import 'babel-polyfill';
import React from 'react';
import DOM from 'react-dom';
// import LogRocket from 'logrocket';
// import * as Sentry from '@sentry/browser';

import App from '.';

const isCi = window.__META__.ci; // eslint-disable-line

if (!isCi) {
  const LogRocket = require('logrocket'); // eslint-disable-line global-require
  const Sentry = require('@sentry/browser'); // eslint-disable-line global-require
  LogRocket.init('ovx5ph/carpe-dalan');
  Sentry.init({
    dsn: 'https://56efb56b3ba44197ad36ba25fb1e64a6@sentry.io/1380053',
  });

  Sentry.configureScope(scope => {
    scope.addEventProcessor(async event => {
      LogRocket.getSessionURL(sessionURL => {
        event.extra.sessionURL = sessionURL; // eslint-disable-line
      });

      return event;
    });
  });

  /* eslint-disable no-console,no-restricted-syntax */
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });

    //   console.log('CLIENT: service worker registration in progress.');
    //   navigator.serviceWorker.register('/sw.js').then(
    //     () => {
    //       // registration.unregister();
    //       console.log('CLIENT: service worker registration complete.');
    //     },
    //     () => {
    //       console.log('CLIENT: service worker registration failure.');
    //     },
    //   );
    // } else {
    //   console.log('CLIENT: service worker is not supported.');
    // }
  }
}

/* eslint-disable no-underscore-dangle */
DOM.render(
  <App {...window.__SESSION__} {...window.__META__} />,
  document.getElementById('root'),
);
