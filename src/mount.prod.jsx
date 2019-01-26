import 'babel-polyfill';
import React from 'react';
import DOM from 'react-dom';
import LogRocket from 'logrocket';
import * as Sentry from '@sentry/browser';

import App from '.';

LogRocket.init('ovx5ph/carpe-dalan');
Sentry.init({
  dsn: 'https://56efb56b3ba44197ad36ba25fb1e64a6@sentry.io/1380053',
});

/* eslint-disable no-underscore-dangle */
DOM.render(
  <App {...window.__SESSION__} {...window.__META__} />,
  document.getElementById('root'),
);
/* eslint-disable no-console */
if ('serviceWorker' in navigator) {
  console.log('CLIENT: service worker registration in progress.');
  navigator.serviceWorker.register('/sw.js').then(
    () => {
      console.log('CLIENT: service worker registration complete.');
    },
    () => {
      console.log('CLIENT: service worker registration failure.');
    },
  );
} else {
  console.log('CLIENT: service worker is not supported.');
}
