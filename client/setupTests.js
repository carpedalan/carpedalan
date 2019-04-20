import path from 'path';
import 'jest-styled-components';
import { configure } from 'enzyme';
import * as EnzymeAdapter from 'enzyme-adapter-react-16';
configure({ adapter: new EnzymeAdapter() });
global.__META__ = {
  cdn: 'photos.carpedalan.com'
}
// import dotenv from 'dotenv-safe';
// import d from 'docker-compose';

// dotenv.config();
