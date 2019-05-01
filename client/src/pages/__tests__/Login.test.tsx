import { shallow } from 'enzyme';
import * as React from 'react';
import { Redirect } from 'react-router';
import * as req from 'superagent';

import Login from '../Login';

const mockResponse = { body: 'body', status: 200 };
jest.mock('superagent', () => ({
  post: jest.fn().mockReturnThis(),
  send: jest.fn(() => Promise.resolve(mockResponse)),
}));

const mockedReq = (req as any) as Mock<typeof req>;

describe('<Login />', () => {
  beforeEach(jest.clearAllMocks);
  it('should match snapshot', () => {
    const app = shallow(<Login />);
    expect(app).toMatchSnapshot();
  });

  it('should have a working input', () => {
    const app = shallow(<Login />);
    const val = 'val';
    app
      .find('[data-test="password"]')
      .simulate('change', { target: { value: val } });
    expect(app.find('[data-test="password"]').props().value).toBe(val);
  });

  it('should fire an api call on submit', () => {
    const app = shallow(<Login />);
    const val = 'val';
    app.find('[data-test="submit"]').simulate('submit', new Event('submit'));
    expect(mockedReq.send).toHaveBeenCalledWith({ password: '' });
  });

  it('should show an error if there is one', async () => {
    mockedReq.send.mockImplementation(() =>
      Promise.reject({ response: { body: { message: 'error' } }, status: 420 }),
    );
    const app = shallow(<Login />);
    app.find('[data-test="submit"]').simulate('submit', new Event('submit'));

    await new Promise(resolve => setTimeout(resolve, 0));
    expect(app.find('[data-test="error"]').text()).toBe('error');
  });

  it('should not show the error after typing after an error', async () => {
    const app = shallow(<Login />);
    const val = 'val';
    mockedReq.send.mockImplementation(() =>
      Promise.reject({ response: { body: { message: 'error' } }, status: 420 }),
    );
    app.find('[data-test="submit"]').simulate('submit', new Event('submit'));

    await new Promise(resolve => setTimeout(resolve, 0));
    expect(app.find('[data-test="error"]').text()).toBe('error');
    app
      .find('[data-test="password"]')
      .simulate('change', { target: { value: 'something' } });
    expect(app.find('[data-test="error"]').exists()).toBe(false);
  });
  // @TODO needs useEffect support from enzyme :(
  // it('should render a redirect if a user is returned in the response', async () => {
  //   const app = shallow(<Login />);
  //   const val = 'val';
  //   mockedReq.send.mockImplementation(() =>
  //     Promise.resolve({ body: { user: 'read' }, status: 200 }),
  //   );
  //   app.find('[data-test="submit"]').simulate('submit', new Event('submit'));

  //   await new Promise(resolve => setTimeout(resolve, 0));
  //   app.update();
  //   console.log(app.debug());
  //   expect(app.find(Redirect).exists()).toBe(true);
  // });
});
