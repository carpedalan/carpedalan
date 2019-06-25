import axios from 'axios';
import debug from 'debug';
import useUser from 'hooks/useUser';
import { DataProvider } from 'providers/Data';
import RouterContext from 'providers/RouterContext';
import { UserProvider } from 'providers/User';
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from 'Routes';
import { ThemeProvider } from 'styled-components';
import { GlobalStyleComponent, themes } from 'styles/utils';
import { User } from 'User';

const log = debug('App');

const refreshCookie = async () => {
  log('Refreshing cookie', { an: 'object' });
  const response = await axios.post('/v1/refresh');
};

const { useEffect } = React;
const App: React.FC<{ user: User }> = () => {
  const { user: userState } = useUser();

  /**
   * Cloudfront cookie needs to be refreshed every 30s for
   * the images to not 403. This effect well set the cookie at
   * that interval if the user has been authenticated.
   */
  useEffect(() => {
    if (userState) {
      const interval = setInterval(() => {
        refreshCookie();
      }, 1000 * 30);
      return () => clearInterval(interval);
    }
    return () => {};
  }, [userState]);

  return (
    <UserProvider>
      <DataProvider>
        <BrowserRouter>
          <RouterContext>
            <ThemeProvider theme={themes.lite}>
              <>
                <Routes />
                <GlobalStyleComponent />
              </>
            </ThemeProvider>
          </RouterContext>
        </BrowserRouter>
      </DataProvider>
    </UserProvider>
  );
};

export default App;
