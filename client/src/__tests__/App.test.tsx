import { shallow } from 'enzyme';
import * as React from 'react';
import App from '../App';

import { User } from '../User';

describe('<App />', () => {
  it('should match snapshot', () => {
    const app = shallow(<App user={User.read} />);
    expect(app).toMatchSnapshot();
  });
  it('should increment', () => {
    const app = shallow(<App user={User.read} />);
    const something = app.find('[data-test="something"]');
    something.simulate('click');
    expect(app.find('[data-test="something"]').text()).toContain(1);
  });
});
