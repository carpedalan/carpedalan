import axios from 'axios';
import SidebarAndMenu from 'components/SidebarAndMenu';
import useUser from 'hooks/useUser';
import Login from 'pages/Login';
import Request from 'pages/Request';
import { UserContext } from 'providers/User';
import * as React from 'react';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import useTags from 'hooks/useTags';
import debug from 'debug';

const log = debug('components:Routes');

const RedirectToLogin = () => <Redirect to="/" />;

const { lazy, Suspense, useEffect } = React;

const LazySlash = lazy(() =>
  import(/* webpackChunkName: "loggedin" */ 'pages/Slash'),
);

const Spinner = () => <div>Spinner</div>;

const { useState, useContext } = React;
const Routes: React.FC = () => {
  const { fetchTags } = useTags();
  const { setUser, user: globalUser } = useUser();
  useEffect(() => {
    log('route is mounting');
    if (globalUser) {
      fetchTags();
    }
  }, []);

  async function logout() {
    await axios.post('/v1/logout');
    setUser(undefined);
  }

  return (
    <Suspense fallback={<Spinner />}>
      <SidebarAndMenu />
      <Switch>
        <Route exact={true} path="/request" component={Request} />

        {globalUser ? (
          <Route exact={true} path="/" component={LazySlash} />
        ) : (
          <Route exact={true} path="/" component={Login} />
        )}
        <Route component={RedirectToLogin} />
      </Switch>
    </Suspense>
  );
};

export default Routes;
