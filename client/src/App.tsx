import * as React from 'react';
import { BrowserRouter, Link, Redirect, Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import { User } from './User';

const { useState } = React;
const App: React.FC<{ user: User }> = ({ user }) => {
  const [userState, setUser] = useState(user);
  const [count, setCount] = useState(0);
  const incrementCount = () => setCount(count + 1);
  return (
    <BrowserRouter>
      <Link to="login">Login</Link>
      <Switch>
        <Route exact={true} path="/login" component={Login} />
      </Switch>
      <div data-test="something" onClick={incrementCount}>
        ffuck yes{count}
      </div>
    </BrowserRouter>
  );
};

export default App;
