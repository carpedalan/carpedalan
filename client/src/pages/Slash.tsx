import useUser from 'hooks/useUser';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { default as styled } from 'styled-components';
import { User } from 'User';

const { useState } = React;
const something = '12px';

interface InputProps {
  readonly width?: number;
}
const InputForm =
  styled.form <
  InputProps >
  `
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  max-width: ${({ width }) => width}px;
  max-height: 25em;
  width: 80vw;
  height: 80vh;
  input {
    text-align: center;
  }
`;

const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const [count, setCount] = useState(0);
  const incrementCount = (): void => setCount(count + 1);
  const { setUser, user } = useUser();
  return (
    <div data-testid="home" onClick={incrementCount}>
      <InputForm width={200}>{user}</InputForm>
      {history.location.pathname}
      {count}
    </div>
  );
};

export default Login;
