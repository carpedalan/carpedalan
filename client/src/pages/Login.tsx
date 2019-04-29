import useApi from 'hooks/useApi';
import useForm from 'hooks/useForm';
import useUser, { User } from 'hooks/useUser';
import * as React from 'react';
import { Redirect } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';
import { default as styled } from 'styled-components';
import Button from 'styles/Button';
import Input from 'styles/Input';
import * as req from 'superagent';

import { InputForm, InputWrapper, StyledButton, StyledTitle } from './styles';

const { useEffect, useState } = React;
/**
 * Post Login api caller
 *
 * @param {Paths.Login.RequestBody} reqBody
 * @returns {Promise<Paths.Login.Responses.$200>}
 */
const postLogin = async (
  reqBody: Paths.Login.RequestBody,
): Promise<Paths.Login.Responses.$200> => {
  try {
    const { body, status } = await req.post('/v1/login').send(reqBody);
    if (status > 399) {
      throw body as Components.Schemas.Error;
    }
    return body as Paths.Login.Responses.$200;
  } catch (e) {
    if (e.response) throw e.response.body as Components.Schemas.Error;
    throw e as Components.Schemas.Error;
  }
};
/**
 * Login route component. Includes form and api effects
 */
const Login: React.FC = () => {
  const { setUser, user } = useUser();
  const [showError, shouldShowError] = useState(true);
  /**
   * Change handler passed intended for passage to `useField`. Has
   * state side effect of setting error showing to false
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e
   * @returns
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    shouldShowError(false);
    return e.target.value;
  };

  const { useField, setValue, form } = useForm('myForm');

  const passwordInput = useField({ handleChange, field: 'password' });
  const { request, error, response, loading } = useApi(postLogin);
  useEffect(
    () => {
      setUser(response && response.user);
    },
    [response],
  );

  /**
   * Submit hanlder. Calls the login API.
   *
   * @param {React.FormEvent<HTMLFormElement>} e
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    shouldShowError(true);
    request({
      password: String(passwordInput.value),
    });
  };

  return (
    <InputWrapper>
      <InputForm data-testid="submit" onSubmit={handleSubmit}>
        <StyledTitle center={true}>Login</StyledTitle>
        {user}
        <Input>
          <input data-test="password" type="password" {...passwordInput} />
        </Input>
        <Button data-testid="submit-button" type="submit">
          Login
        </Button>
        {error && showError && !user ? (
          <div data-testid="error">{error.message}</div>
        ) : null}{' '}
        {user ? <Redirect to="/" /> : null}
      </InputForm>
    </InputWrapper>
  );
};

export default Login;
