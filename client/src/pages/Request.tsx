import axios from 'axios';
import useApi from 'hooks/useApi';
import useForm from 'hooks/useForm';
import useUser, { User } from 'hooks/useUser';
import * as React from 'react';
import { Redirect } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';
import { default as styled } from 'styled-components';
import Button from 'styles/Button';
import Input from 'styles/Input';

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
    const { data, status } = await axios.post('/v1/request', reqBody);
    return data as Paths.Login.Responses.$200;
  } catch (e) {
    if (e.response) throw e.response.body as Components.Schemas.Error;
    throw e as Components.Schemas.Error;
  }
};
/**
 * Request route component. Includes form and api effects
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

  const { useField, setValue, form } = useForm('request');

  const nameInput = useField({
    handleChange,
    field: 'name',
    validate: v => (!v ? 'Is required' : false),
  });
  const emailInput = useField({ handleChange, field: 'email' });
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
      name: String(nameInput.value),
      email: String(emailInput.value),
    });
  };

  return (
    <InputWrapper>
      <InputForm data-test="submit" onSubmit={handleSubmit}>
        <StyledTitle center={true}>Login</StyledTitle>
        {user}
        <Input>
          <label htmlFor="name">Name</label>
          <input
            data-test="name"
            type="text"
            name="name"
            id="name"
            {...nameInput}
          />
          {nameInput.error}
        </Input>
        <Input>
          <label htmlFor="name">Email</label>
          <input
            data-test="email"
            type="text"
            name="email"
            id="email"
            {...emailInput}
          />
        </Input>
        <Button data-test="submit-button" type="submit">
          Login
        </Button>
        {error && showError && !user ? (
          <div data-test="error">{error.message}</div>
        ) : null}
        {user ? <Redirect to="/" /> : null}
      </InputForm>
    </InputWrapper>
  );
};

export default Login;
