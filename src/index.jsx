import React, { createContext, useState } from 'react';
import { number, oneOf, string } from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import request from 'superagent';

import { READ_USER, WRITE_USER } from '../server/constants';

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

function Root({ user, defaultTheme, status }) {
  const [userState, setUser] = useState(user);
  const [theme, setTheme] = useState(defaultTheme);
  const [shouldShowSidebar, setShouldShowSidebar] = useState(false);

  const handleChangeTheme = async () => {
    const newTheme = theme === 'dark' ? 'lite' : 'dark';
    if (theme === 'dark') setTheme('lite');
    else setTheme('dark');
    await request.post('/api/user', {
      defaultTheme: newTheme,
    });
  };

  const toggleMenu = () => setShouldShowSidebar(!shouldShowSidebar);

  return (
    <WindowProvider>
      <ThemeProvider theme={themes[theme]}>
        <User.Provider value={{ user: userState, setUser }}>
          <APIProvider>
            <TagProvider>
              <PostProvider>
                <TagsPostProvider>
                  <>
                    <BrowserRouter>
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
                          {userState === WRITE_USER ? (
                            <Route exact path="/admin" component={Admin} />
                          ) : null}
                          {[WRITE_USER, READ_USER].includes(userState) ? (
                            <>
                              <Route exact path="/" component={Slash} />
                              <Route
                                exact
                                path="/archive"
                                component={Archive}
                              />
                              <Route exact path="/tag/:tag" component={Tag} />

                              <Route component={NotFound} />
                            </>
                          ) : (
                            <Route
                              render={props => (
                                <Login {...props} status={status} />
                              )}
                            />
                          )}
                        </Switch>
                      </>
                    </BrowserRouter>
                    <GlobalStyleComponent />
                  </>
                </TagsPostProvider>
              </PostProvider>
            </TagProvider>
          </APIProvider>
        </User.Provider>
      </ThemeProvider>
    </WindowProvider>
  );
}

Root.defaultProps = {
  defaultTheme: 'lite',
  user: undefined,
  status: undefined,
};

Root.propTypes = {
  user: string,
  defaultTheme: oneOf(Object.keys(themes)),
  status: number,
};

export default Root;
