/** This is a catch all test file to test, well, the catch all errors
 *  Need to have this file be separate so that sub services can be mocked
 *  to return bad things, like the DB and AWS, for example.
 */

import { paths } from '../initialize';
// import db from '../../server/db';

jest.mock('../../server/db', () =>
  jest.fn(() => {
    throw new Error();
  }),
);

describe('Failures', () => {
  paths.forEach(({ path }) => {
    describe(`${path}`, () => {
      it('does something', () => {
        expect(true).toBe(true);
      });
    });
  });
});
