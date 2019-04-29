import { shallow } from 'enzyme';
import * as React from 'react';

import App from '../App';

describe('<App />', () => {
  it('should match snapshot', () => {
    const app = shallow(<App user="read" />);
    expect(app).toMatchSnapshot();
  });
});
