import useApi, { HttpMethods } from 'hooks/useApi';
import useForm from 'hooks/useForm';
import useUser from 'hooks/useUser';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { default as styled } from 'styled-components';
import Button from 'styles/Button';
import Input from 'styles/Input';
import { User } from 'User';
import { InputForm, InputWrapper, StyledButton, StyledTitle } from './styles';
/**
 * Login route component. Includes form and api effects
 */
export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const { setUser, user } = useUser();
  const loginPost = useApi('/login', HttpMethods.post);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    return e.target.value;
  };
  const { useField, setValue, form } = useForm('myForm');
  const input = useField({ handleChange, field: 'password ' });
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      console.log('form', form);
      const response = await loginPost.request({ password: form.password });
    } catch (e) {
      console.error('e');
    }
  };

  return (
    <InputWrapper>
      <InputForm onSubmit={handleSubmit}>
        <StyledTitle center={true}>Login</StyledTitle>
        {user}
        <Input>
          <input type="password" {...input} />
        </Input>
        <Button type="submit">Login</Button>
      </InputForm>
      {loginPost.response ? loginPost.response.data : null}
      {history.location.pathname}
    </InputWrapper>
  );
};

export default Login;
