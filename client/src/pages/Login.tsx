import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

const { useState } = React;

const Login: React.SFC<RouteComponentProps> = ({ history }) => {
  const [count, setCount] = useState(0);
  const incrementCount = () => setCount(count + 1);

  return (
    <div onClick={incrementCount}>
      {history.location.pathname}
      {count}
    </div>
  );
};

export default Login;
