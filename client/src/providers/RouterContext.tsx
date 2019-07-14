import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';

const { useContext } = React;

export const RouterContext = React.createContext({
  match: {
    isExact: false,
    params: {},
    path: '',
    url: '',
  },
  location: {
    pathname: '',
    search: {},
    state: {},
    hash: '',
  },
  history: {},
});

export const useRouterContext = () => useContext(RouterContext);

interface RouterContextProviderInterface extends RouteComponentProps {
  children: React.ReactChild;
}

export const RouterContextProvider = ({
  children,
  match,
  location,
  history,
}: RouterContextProviderInterface) => (
  <RouterContext.Provider value={{ match, location, history }}>
    {children}
  </RouterContext.Provider>
);

export default withRouter(RouterContextProvider);
