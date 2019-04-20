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
  }
}
const App = hotEntry;
ReactDOM.render(
  <App {...window.__SESSION__} />,
  document.getElementById('root'),
);
