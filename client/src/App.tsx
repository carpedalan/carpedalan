import useUser from 'hooks/useUser';
import Login from 'pages/Login';
import Request from 'pages/Request';
import Slash from 'pages/Slash';
import * as React from 'react';
import { BrowserRouter, Link, Redirect, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyleComponent, themes } from 'styles/utils';

import { User } from './User';

const RedirectToLogin = () => <Redirect to="/login" />;

const { useState, useEffect } = React;
const App: React.FC<{ user: User }> = ({ user }) => {
  // const [userState, setUser] = useState(user);
  const { setUser, user: globalUser } = useUser();
  // useEffect(
  //   () => {
  //     console.log('setting');
  //     setUser(user);
  //   },
  //   [user],
  // );

  return (
    <BrowserRouter>
      <ThemeProvider theme={themes.lite}>
        <>
          <Link to="login">Login</Link>
          <Link to="/">Slash</Link>
          {globalUser ? (
            <Switch>
              <Route exact={true} path="/" component={Slash} />
              <Route component={RedirectToLogin} />
            </Switch>
          ) : (
            <Switch>
              <Route exact={true} path="/request" component={Request} />
              <Route exact={true} path="/login" component={Login} />
              <Route component={RedirectToLogin} />
            </Switch>
          )}
          <GlobalStyleComponent />
        </>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
