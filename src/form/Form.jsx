import React, { createContext, useEffect, useReducer } from 'react';
import { arrayOf, node, shape, func, oneOfType, string } from 'prop-types';
import get from 'lodash/get';
import unset from 'lodash/unset';
import isUndefined from 'lodash/isUndefined';
import set from 'lodash/set';
import isEmpty from 'lodash/isEmpty';

import log from '../utils/log';

export const FormContext = createContext({});
const { Provider: FormProvider } = FormContext;

const initialFormReducerState = {
  values: {},
  errors: {},
  meta: {},
};

const reducer = (
  state,
  { type, payload, payload: { field, value, error } = {} },
) => {
  log.info(type, payload);
  switch (type) {
    case 'CHANGE':
      set(state.values, field, value);
      return {
        ...state,
        meta: {
          isDirty: true,
        },
      };
    case 'VALIDATION':
      return {
        ...state,
        errors: {
          ...state.errors,
          [field]: error,
        },
        meta: {
          ...state.meta,
          invalid: true,
        },
      };
    case 'FORM_VALIDATION':
      return {
        ...state,
        errors: payload,
        meta: {
          ...state.meta,
          invalid: true,
        },
      };
    case 'START_SUBMIT':
      return {
        ...state,
        meta: {
          ...state.meta,
          submitting: true,
        },
      };
    case 'STOP_SUBMIT':
      return {
        ...state,
        meta: {
          ...state.meta,
          submitting: false,
        },
      };
    case 'SUBMIT_SUCCEEDED':
      return {
        ...state,
        meta: {
          ...state.meta,
          submitting: false,
          submitSucceeded: true,
        },
      };
    case 'SUBMIT_FAILED':
      return {
        ...state,
        errors: payload,
        meta: {
          ...state.meta,
          submitting: false,
          submitSucceeded: false,
        },
      };
    case 'REGISTER_FIELD':
      if (isUndefined(get(state.values, payload)))
        set(state.values, payload, null);
      return state;
    case 'UNREGISTER_FIELD':
      unset(state.values, payload);
      return state;
    case 'INITIALIZE':
      return {
        ...initialFormReducerState,
        values: payload,
      };
    default:
      return state;
  }
};

function Form({
  children,
  initial = {},
  onSubmit,
  validate: validation,
  effect,
}) {
  const [state, dispatch] = useReducer(reducer, initialFormReducerState, {
    type: 'INITIALIZE',
    payload: initial,
  });

  const registerField = name =>
    dispatch({
      type: 'REGISTER_FIELD',
      payload: name,
    });

  const unregisterField = name =>
    dispatch({
      type: 'UNREGISTER_FIELD',
      payload: name,
    });

  const change = ({ field, value }) =>
    dispatch({
      type: 'CHANGE',
      payload: { field, value },
    });

  const validate = ({ field, error }) =>
    dispatch({ type: 'VALIDATION', payload: { field, error } });

  const submit = async () => {
    dispatch({
      type: 'START_SUBMIT',
    });

    const errors = validation(state.values);

    if (errors && !isEmpty(errors)) {
      dispatch({ type: 'FORM_VALIDATION', payload: errors });
      dispatch({
        type: 'SUBMIT_FAILED',
        payload: errors,
      });
    } else {
      try {
        await onSubmit(state.values);
        dispatch({
          type: 'SUBMIT_SUCCEEDED',
        });
      } catch (e) {
        dispatch({
          type: 'SUBMIT_FAILED',
          payload: e,
        });
      } finally {
        dispatch({
          type: 'SUBMIT_STOP',
        });
      }
    }
  };

  useEffect(() => dispatch({ type: 'INITIALIZE', payload: initial }), [
    initial,
  ]);

  useEffect(
    () => {
      effect({ state, dispatch, change });
    },
    [state],
  );

  return (
    <FormProvider
      value={{
        change,
        validate,
        state,
        submit,
        values: state.values,
        registerField,
        unregisterField,
      }}
    >
      {children}
    </FormProvider>
  );
}

Form.defaultProps = {
  initial: {},
  onSubmit: () => {},
  validate: () => {},
  effect: () => {},
  children: [],
};

Form.propTypes = {
  initial: shape({}),
  onSubmit: func,
  validate: func,
  effect: func,
  children: arrayOf(oneOfType([node, func, string])),
};

export default Form;
