import axios from 'axios';
import useApi from 'hooks/useApi';
import useForm from 'hooks/useForm';
import useUser from 'hooks/useUser';
import * as React from 'react';
import Button from 'styles/Button';
import DangerText from 'styles/DangerText';
import Input from 'styles/Input';

import { InputForm, InputWrapper, StyledButton, StyledTitle } from './styles';

const { useState } = React;
/**
 * Post Invitation api caller
 *
 * @param {Paths.Invitation.RequestBody} reqBody
 * @returns {Promise<Void>}
 */
const requestInvitation = async (
  reqBody: Paths.Invitation.RequestBody,
): Promise<void> => {
  try {
    const { data, status } = await axios.post('/v1/invitation', reqBody);
  } catch (e) {
    if (e.response) throw e.response.data as Components.Schemas.Error;
    throw e as Components.Schemas.Error;
  }
};
/**
 * Request route component. Includes form and api effects
 */
const Invitation: React.FC = () => {
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
  const { request, error, response, loading, retry } = useApi(
    requestInvitation,
  );

  /**
   * Submit hanlder. Calls the Invitation API.
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
        <StyledTitle center={true}>Request</StyledTitle>
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
        <Button
          data-test="submit-button"
          data-testid="submit-button"
          type="submit"
        >
          Request invite
        </Button>
        {error && showError && !user && error.errors
          ? error.errors.map(({ message, path }) => (
              <DangerText key="path" data-test="error" data-testid="error">
                {path}: {message}
              </DangerText>
            ))
          : null}
      </InputForm>
    </InputWrapper>
  );
};

export default Invitation;
