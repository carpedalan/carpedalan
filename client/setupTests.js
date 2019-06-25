/* eslint-disable */
const path = require('path');

require('jest-dom/extend-expect');

const { configure } = require('enzyme');
const EnzymeAdapter = require('enzyme-adapter-react-16');

configure({ adapter: new EnzymeAdapter() });
global.__META__ = {
  cdn: 'photos.carpedalan.com',
};
// import dotenv from 'dotenv-safe';
// import d from 'docker-compose';

// dotenv.config();
