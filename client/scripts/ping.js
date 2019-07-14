#!/usr/bin/env node

const http = require('http');

http.get(
  {
    hostname: 'localhost',
    port: 4000,
    path: '/dist/client.bundle.js',
    agent: false, // Create a new agent just for this one request
  },
  res => {
    if (res.statusCode === 200) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  },
);
