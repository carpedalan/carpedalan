import axios, { AxiosPromise, AxiosResponse, AxiosStatic } from 'axios';
import { shallow } from 'enzyme';
import { UserContext, UserProvider } from 'providers/User';
import * as React from 'react';
import { MemoryRouter, Redirect, Route } from 'react-router';
import { BrowserRouter, Link } from 'react-router-dom';
import {
  act,
  cleanup,
  fireEvent,
  render,
  waitForElement,
} from '@testing-library/react';

import Slash from '../Slash';

const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('axios');

describe('<Slash />', () => {
  beforeEach(jest.resetAllMocks);
  it('should match snapshot', () => {
    const app = shallow(<Slash />);
    expect(app).toMatchSnapshot();
  });
  // it('should')
});
