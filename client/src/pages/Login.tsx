import useForm from 'hooks/useForm';
import useUser from 'hooks/useUser';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { default as styled } from 'styled-components';
import Button from 'styles/Button';
import Input from 'styles/Input';
import { User } from 'User';
import { InputForm, InputWrapper, StyledButton, StyledTitle } from './styles';
// interface InputProps {
//   readonly width?: number;
// }
// const InputForm =
//   styled.form <
//   InputProps >
//   `
//   display: flex;
//   align-items: center;
//   justify-content: space-around;
//   flex-direction: column;
//   max-width: ${({ width }) => width}px;
//   max-height: 25em;
//   width: 80vw;
//   height: 80vh;
//   input {
//     text-align: center;
//   }
// `;

const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const { setUser, user } = useUser();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    return e.target.value;
  };
  const { useField, setValue, form } = useForm('myForm');
  const input = useField({ handleChange, field: 'input' });

  return (
    <InputWrapper>
      <InputForm>
        <StyledTitle center={true}>Login</StyledTitle>
        {user}
        <Input>
          <input type="password" {...input} />
        </Input>
        <Button type="submit">Login</Button>
      </InputForm>
      {history.location.pathname}
      {/* {count} */}
    </InputWrapper>
  );
};

export default Login;
