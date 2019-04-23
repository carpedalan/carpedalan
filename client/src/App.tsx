import * as React from 'react';
import { BrowserRouter, Link, Redirect, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import useUser from './hooks/useUser';
import Login from './pages/Login';
import Slash from './pages/Slash';
import { GlobalStyleComponent, themes } from './styles';
import { User } from './User';

const { useState } = React;
const App: React.FC<{ user: User }> = ({ user }) => {
  // const [userState, setUser] = useState(user);
  const [count, setCount] = useState(0);
  const { user: globalUser, setUser } = useUser();
  const incrementCount = () => setUser(User.read);
  return (
    <BrowserRouter>
      <ThemeProvider theme={themes.lite}>
        <>
          <Link to="login">Login</Link>
          <Link to="/">Slash</Link>
          <Switch>
            <Route exact={true} path="/login" component={Login} />
            <Route exact={true} path="/" component={Slash} />
          </Switch>
          <div data-test="something" onClick={incrementCount}>
            ffuck yes{count}
            {globalUser}
          </div>
          <GlobalStyleComponent />
        </>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
