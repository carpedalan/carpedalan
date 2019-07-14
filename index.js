// eslint-disable-next-line
require = require('esm')(module);
// Please, Leif Dalan, get rid of this line above this line
// Its that dude that wrote lodash but holy crap its awesome.
// Pretty soon node will support esm natively, where we can
// get rid of this. It only adds one line of transpilation and
// as far as I can tell doesn't fuck up breakpoints.
// - Leif of christmas past
const path = require('path');

const dotenv = require('dotenv-safe');

console.log('dot envingzzz'); // eslint-disable-line
dotenv.config({
  path:
    process.env.NODE_ENV === 'test'
      ? path.resolve(process.cwd(), '.env.test')
      : path.resolve(process.cwd(), '.env'),
});
const thing = require('./server/server.js');

try {
  const { setup, start } = thing;
  const { app } = setup();
  start(app);
} catch (e) {
  console.log('catching', e); // eslint-disable-line
}
