import * as React from 'react';
import * as ReactDOM from 'react-dom';

import hotEntry from './hotEntry';
import { User } from './User';

// export default function App() {
//   return <div>hello</div>
// }
/* eslint-disable */
// eslint-disable-next-line no-underscore-dangle

declare global {
  interface Window {
    __SESSION__: {
      user: User;
      requests: number;
    };
    __META__: {
      cdn: string;
    };
  }
}
// Doing this so that theres a trace on Chrome Debugger since
// we are using the debug module (you lose line numbers)
console.log = console.warn;
const App = hotEntry;
ReactDOM.render(
  <App {...window.__SESSION__} />,
  document.getElementById('root'),
);
