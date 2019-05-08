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

import Request from '../Request';

const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('axios');

describe('<Request />', () => {
  beforeEach(jest.resetAllMocks);
  it('should match snapshot', () => {
    const app = shallow(<Request />);
    expect(app).toMatchSnapshot();
  });

  it('should fire an api call on submit', () => {
    const app = shallow(<Request />);
    const val = 'val';
    app.find('[data-test="submit"]').simulate('submit', new Event('submit'));
    expect(mockedAxios.post).toHaveBeenCalledWith('/v1/invitation', {
      name: '',
      email: '',
    });
  });

  it('should have a working input', () => {
    const app = shallow(<Request />);
    const val = 'val';
    app
      .find('[data-test="name"]')
      .simulate('change', { target: { value: val } });
    expect(app.find('[data-test="name"]').props().value).toBe(val);
  });

  it('should show an error if there is one', async () => {
    mockedAxios.post.mockImplementation(() =>
      Promise.reject({
        response: {
          data: { errors: [{ path: 'error', message: 'an error' }] },
        },
        status: 420,
      }),
    );
    const app = shallow(<Request />);
    app.find('[data-test="submit"]').simulate('submit', new Event('submit'));

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(app.find('[data-test="error"]').text()).toBe('error: an error');
  });

  it('should not show the error after typing after an error', async () => {
    mockedAxios.post.mockImplementation(() =>
      Promise.reject({
        response: {
          data: { errors: [{ path: 'error', message: 'an error' }] },
        },
        status: 420,
      }),
    );
    const app = shallow(<Request />);
    app.find('[data-test="submit"]').simulate('submit', new Event('submit'));

    await new Promise(resolve => setTimeout(resolve, 0));
    expect(app.find('[data-test="error"]').text()).toBe('error: an error');
    app
      .find('[data-test="name"]')
      .simulate('change', { target: { value: 'something' } });
    expect(app.find('[data-test="error"]').exists()).toBe(false);
  });

  it('should show an error', async () => {
    mockedAxios.post.mockImplementation(() =>
      Promise.reject({
        response: {
          data: { errors: [{ path: 'error', message: 'an error' }] },
        },
        status: 420,
      }),
    );
    const { getByTestId } = render(
      <BrowserRouter>
        <Request />
      </BrowserRouter>,
    );
    fireEvent.click(getByTestId('submit-button'));
    const errorText = await waitForElement(() => getByTestId('error'));

    expect(errorText).toHaveTextContent('error');
  });
});
