import 'babel-polyfill';
import React from 'react';
import DOM from 'react-dom';

import App from './hotEntry';

DOM.render(<App />, document.getElementById('root'));
