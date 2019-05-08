import axios, { AxiosResponse, AxiosStatic } from 'axios';
import { shallow } from 'enzyme';
import * as React from 'react';
import { MemoryRouter, Redirect, Route } from 'react-router';
import { BrowserRouter, Link } from 'react-router-dom';
import {
  act,
  cleanup,
  fireEvent,
  render,
  waitForElement,
} from 'react-testing-library';

import Login from '../Login';

const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('axios');

describe('<Login />', () => {
  beforeEach(jest.resetAllMocks);
  it('should match snapshot', () => {
    const app = shallow(<Login />);
    expect(app).toMatchSnapshot();
  });

  it('should fire an api call on submit', () => {
    const app = shallow(<Login />);
    const val = 'val';
    app.find('[data-test="submit"]').simulate('submit', new Event('submit'));
    expect(mockedAxios.post).toHaveBeenCalledWith('/v1/login', {
      password: '',
    });
  });

  it('should have a working input', () => {
    const app = shallow(<Login />);
    const val = 'val';
    app
      .find('[data-test="password"]')
      .simulate('change', { target: { value: val } });
    expect(app.find('[data-test="password"]').props().value).toBe(val);
  });

  it('should show an error if there is one', async () => {
    mockedAxios.post.mockImplementation(() =>
      Promise.reject({ response: { data: { message: 'error' } }, status: 420 }),
    );
    const app = shallow(<Login />);
    app.find('[data-test="submit"]').simulate('submit', new Event('submit'));

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(app.find('[data-test="error"]').text()).toBe('error');
  });

  it('should not show the error after typing after an error', async () => {
    mockedAxios.post.mockImplementation(() =>
      Promise.reject({ response: { data: { message: 'error' } }, status: 420 }),
    );
    const app = shallow(<Login />);
    app.find('[data-test="submit"]').simulate('submit', new Event('submit'));

    await new Promise(resolve => setTimeout(resolve, 0));
    expect(app.find('[data-test="error"]').text()).toBe('error');
    app
      .find('[data-test="password"]')
      .simulate('change', { target: { value: 'something' } });
    expect(app.find('[data-test="error"]').exists()).toBe(false);
  });

  it('should show an error', async () => {
    mockedAxios.post.mockImplementation(() =>
      Promise.reject({ response: { data: { message: 'error' } }, status: 420 }),
    );
    const { getByTestId } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );
    fireEvent.click(getByTestId('submit-button'));
    const errorText = await waitForElement(() => getByTestId('error'));

    expect(errorText).toHaveTextContent('error');
  });

  it('should redirect on success', async () => {
    const RedirectComponent = () => <div data-testid="redirected">Hi</div>;
    mockedAxios.post.mockImplementation(() =>
      Promise.resolve({
        data: { user: 'read' },
        status: 200,
      } as AxiosResponse),
    );
    const { getByTestId } = render(
      <MemoryRouter>
        <Link data-testid="login-link" to="login">
          Login
        </Link>
        <Route exact={true} path="/" component={RedirectComponent} />
        <Route path="/login" component={Login} />
      </MemoryRouter>,
    );
    fireEvent.click(getByTestId('login-link'));
    const errorText = await waitForElement(() => getByTestId('submit'));

    fireEvent.click(getByTestId('submit-button'));
    const redirected = await waitForElement(() => getByTestId('redirected'));
  });
});
