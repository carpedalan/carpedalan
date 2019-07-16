import React, { useContext, useState } from 'react';
import { number, shape } from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import styled from 'styled-components';
import request from 'superagent';

import Success from '../components/Success';
import InputField from '../fields/InputField';
import Field from '../form/Field';
import Form from '../form/Form';
import Submit from '../form/Submit';
import { API_PATH } from '../../shared/constants';

import { User } from '..';

import { prop } from '../styles';
import DangerText from '../styles/DangerText';
import Title from '../styles/Title';

import Baby from './Baby';

const emailRe = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; // eslint-disable-line

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
const InputForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  max-width: ${prop('height')};
  max-height: 25em;
  width: 80vw;
  height: 80vh;
  input {
    text-align: center;
  }
`;

InputForm.defaultProps = {
  height: '25em',
};

const StyledTitle = styled(Title)`
  margin: 0;
`;

// const StyledButton = styled.button`
//   color: ${getThemeValue(BRAND_COLOR)};
//   background: ${getThemeValue(MAIN)};
//   border: none;
//   padding: 1em 3em;
//   cursor: pointer;
//   outline: inherit;
// `;

const TestButton = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  top: 0;
  left: 0;
`;

export default function Login({ location: { pathname }, status }) {
  const { setUser } = useContext(User);
  const [error, setError] = useState(null);
  const [requestAccess /* setRequestAccess */] = useState(false);
  const [accessRequested, setAccessRequested] = useState(false);

  const submitLogin = async ({ password }) => {
    try {
      const response = await request.post(`${API_PATH}/login`, { password });

      await request.get('/');
      setUser(response.body.user);
    } catch (e) {
      setError(e);
      throw e;
    }
  };

  const submitRequestAccess = async ({ email, firstName, lastName }) => { // eslint-disable-line
    try {
      await request.post(`${API_PATH}/invitation`, {
        email: 'test@test.com',
        firstName: 'test',
        lastName: 'farts',
      });
      setAccessRequested(true);
    } catch (e) {
      throw e;
    }
  };
  const redirect = pathname === '/login' ? '/' : pathname;
  return (
    <>
      <Route exact path="/baby" component={Baby} />
      <InputWrapper>
        <InputForm>
          {requestAccess ? (
            <>
              {accessRequested ? (
                <>
                  <Success />
                  <div>Thank you! Your request has been sent!</div>
                </>
              ) : (
                <>
                  <StyledTitle center>Request Access</StyledTitle>
                  <Form onSubmit={submitRequestAccess}>
                    <Field
                      name="firstName"
                      component={InputField}
                      placeholder="First Name"
                      label="First Name"
                      id="firstName"
                    />
                    <Field
                      name="lastName"
                      component={InputField}
                      placeholder="Last Name"
                      label="Last Name"
                      id="lasttName"
                      validate={val => (!val ? 'Last name is required' : false)}
                    />
                    <Field
                      name="email"
                      component={InputField}
                      placeholder="Email address"
                      label="Email Address"
                      id="email"
                      validate={email =>
                        !emailRe.test(email) ? 'Must be a valid email' : false
                      }
                    />
                    <Submit text="Send Request" />
                  </Form>
                </>
              )}
            </>
          ) : (
            <>
              {status ? <StyledTitle center>{status}</StyledTitle> : null}
              <StyledTitle center>Login</StyledTitle>
              <Form onSubmit={submitLogin}>
                {({ meta }) => {
                  return (
                    <>
                      {meta.submitSucceeded ? <Redirect to={redirect} /> : null}
                      <Field
                        name="password"
                        component={InputField}
                        placeholder="Password, please"
                        type="password"
                      />
                      {error ? (
                        <DangerText>Oops! That didn&apos;t work</DangerText>
                      ) : null}
                      <Submit text="Login" />
                    </>
                  );
                }}
              </Form>
            </>
          )}
          {!requestAccess ? (
            <a href="&#109;a&#105;l&#116;&#111;&#58;%&#54;&#51;ar&#112;e%64&#97;lan&#64;&#103;mail&#46;&#99;%&#54;F%6&#68;?subject=I'd like access to carpedalan.com, please!">
              Request Access
            </a>
          ) : null}
        </InputForm>
        <TestButton onClick={() => submitRequestAccess({})} />
      </InputWrapper>
    </>
  );
}

Login.defaultProps = {
  status: undefined,
};

Login.propTypes = {
  location: shape({}).isRequired,
  status: number,
};
