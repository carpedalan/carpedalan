import React, { createContext, useEffect, useState } from 'react';
import { node, string } from 'prop-types';
import styled from 'styled-components';
import request from 'superagent';

import { CF_TIMEOUT, API_PATH } from '../../shared/constants';
import { setInterval, clearInterval } from '../utils/globals';
import { getThemeValue, DANGER_COLOR } from '../styles';

export const API = createContext({
  request: () => {},
  retry: () => {},
});

class APIError extends Error {}

const Toast = styled.div`
  position: fixed;
  bottom: 1em;
  width: 95vw;
  margin-left: 2.5vw;
  padding: 2em;
  background-color: ${getThemeValue(DANGER_COLOR)};
`;

export default function APIProvider({ children, user }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [interval, createInterval] = useState(null);

  const patch = (...args) => {
    setLoading(true);
    const req = request.patch(...args);
    setLoading(false);
    return req;
  };

  // Function that calls the refresh endpoint with blunt error tolerance. This endpoing
  // refreshes the signed cookie for the private cloudfront distrobution
  const refresh = async () => {
    await request.get(`${API_PATH}/refresh`);
  };

  // Each endpoint when hit already refreshes the cookie, so we can reset the timer
  // that does this automatically to prevent unnecessary cookie refresh polling
  const resetInterval = () => {
    clearInterval(interval);

    createInterval(setInterval(refresh, CF_TIMEOUT));
  };

  // Start polling for a cookie refresh
  useEffect(() => {
    if (user) {
      const thing = setInterval(refresh, CF_TIMEOUT);
      createInterval(thing);
    }
    return () => clearInterval(interval);
  }, [user]);

  const get = async (...args) => {
    let req;
    try {
      setLoading(true);
      req = await request.get(...args);
      resetInterval();
      if (!req.body) throw new APIError('shit!');
    } catch (e) {
      setError('Get failed');
    } finally {
      setLoading(false);
    }
    return req;
  };

  const post = (...args) => {
    setLoading(true);
    const req = request.post(...args);
    setLoading(false);
    return req;
  };
  const del = (...args) => {
    setLoading(true);
    const req = request.del(...args);
    setLoading(false);
    return req;
  };

  return (
    <API.Provider value={{ patch, get, post, del, loading }}>
      {children}
      {error ? <Toast>{error}</Toast> : null}
    </API.Provider>
  );
}

APIProvider.defaultProps = {
  user: null,
};

APIProvider.propTypes = {
  children: node.isRequired,
  user: string,
};
