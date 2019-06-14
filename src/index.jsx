import React, { createContext, useState } from 'react';
import { number, oneOf, string } from 'prop-types';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import request from 'superagent';

import { READ_USER, WRITE_USER } from '../server/constants';
import { API_PATH } from '../shared/constants';

import SplitRoute from './components/SplitRoute';
import Admin from './pages/Admin';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Slash from './pages/Slash';
import Tag from './pages/Tag';
import Archive from './pages/Archive';
import APIProvider from './providers/APIProvider';
import { themes, GlobalStyleComponent } from './styles';
import TagProvider from './providers/TagProvider';
import TagsPostProvider from './providers/TagPostsProvider';
import PostProvider from './providers/PostsProvider';
import WindowProvider from './providers/WindowProvider';
import Sidebar from './components/Sidebar';
import Menu from './styles/Menu';

export const Router = createContext({});

export const User = createContext({
  counter: 0,
  data: [],
  isLoading: false,
});

// eslint-disable-next-line
function Root({ user, defaultTheme, status, requests, api }) {
  const [userState, setUser] = useState(user);
  const [theme, setTheme] = useState(defaultTheme);
  const [shouldShowSidebar, setShouldShowSidebar] = useState(false);

  const handleChangeTheme = async () => {
    const newTheme = theme === 'dark' ? 'lite' : 'dark';
    if (theme === 'dark') setTheme('lite');
    else setTheme('dark');
    await request.post(`${API_PATH}/user`, {
      defaultTheme: newTheme,
    });
  };
  const isLoggedIn = [WRITE_USER, READ_USER].includes(userState);

  const isAdmin = WRITE_USER === userState;

  const toggleMenu = () => setShouldShowSidebar(!shouldShowSidebar);

  return (
    <BrowserRouter>
      <WindowProvider>
        <ThemeProvider theme={themes[theme]}>
          <User.Provider value={{ user: userState, setUser }}>
            <APIProvider user={userState}>
              <TagProvider>
                <PostProvider>
                  <TagsPostProvider>
                    <>
                      <>
                        {!shouldShowSidebar && userState ? (
                          <Menu
                            data-test="menu"
                            size="small"
                            onClick={toggleMenu}
                            type="button"
                          >
                            Menu
                          </Menu>
                        ) : null}
                        <Sidebar
                          isOpen={shouldShowSidebar}
                          userState={userState}
                          setUser={setUser}
                          handleChangeTheme={handleChangeTheme}
                          toggleMenu={toggleMenu}
                        />

                        <Switch>
                          <Route exact path="/login" component={Login} />
                          {isAdmin ? (
                            <Route exact path="/admin" component={Admin} />
                          ) : null}

                          {isAdmin && (
                            <Route
                              exact
                              path="/pending"
                              render={() => (
                                <SplitRoute
                                  load={() =>
                                    import(/* webpackChunkName "panding" */ './components/Pending/PendingTest')
                                  }
                                />
                              )}
                            />
                          )}

                          {isLoggedIn && (
                            <Route exact path="/" component={Slash} />
                          )}
                          {isLoggedIn && (
                            <Route exact path="/faq" component={Slash} />
                          )}
                          {isLoggedIn && (
                            <Route exact path="/baby" component={Slash} />
                          )}
                          {isLoggedIn && (
                            <Route path="/gallery" component={Slash} />
                          )}
                          {isLoggedIn && (
                            <Route exact path="/archive" component={Archive} />
                          )}
                          {isLoggedIn && (
                            <Route path="/tag/:tagName" component={Tag} />
                          )}
                          {isLoggedIn && <Route component={NotFound} />}
                          {!isLoggedIn && (
                            <Route
                              render={props => (
                                <Login {...props} status={status} />
                              )}
                            />
                          )}
                          <Route exact path="/baby" component={Login} />
                        </Switch>
                        {!requests && isLoggedIn && userState !== WRITE_USER ? (
                          <Redirect to="/faq" />
                        ) : null}
                      </>
                      <GlobalStyleComponent />
                    </>
                  </TagsPostProvider>
                </PostProvider>
              </TagProvider>
            </APIProvider>
          </User.Provider>
        </ThemeProvider>
      </WindowProvider>
    </BrowserRouter>
  );
}

Root.defaultProps = {
  defaultTheme: 'lite',
  user: undefined,
  status: undefined,
  requests: undefined,
};

Root.propTypes = {
  user: string,
  defaultTheme: oneOf(Object.keys(themes)),
  status: number,
  requests: number,
};

export default Root;
