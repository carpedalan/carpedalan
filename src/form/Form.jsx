import React, { createContext, useEffect, useReducer, useRef } from 'react';
import { bool, func, node, shape } from 'prop-types';
import get from 'lodash/get';
import unset from 'lodash/unset';
import isUndefined from 'lodash/isUndefined';
import set from 'lodash/set';
import isEmpty from 'lodash/isEmpty';

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
  switch (type) {
    case 'CHANGE':
      set(state.values, field, value);
      return {
        ...state,
        meta: {
          ...state.meta,
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
        errors: { ...state.errors, ...payload },
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
          hasSubmitted: true,
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
          submitFailed: true,
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
  normalize,
  shouldSubmit,
}) {
  const ref = useRef();
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

  const submit = async e => {
    if (e.preventDefault) {
      e.preventDefault();
    }

    dispatch({
      type: 'START_SUBMIT',
    });

    const errors = validation(state.values) || {};

    const hasFieldErrors = Object.keys(state.errors).reduce(
      (acc, key) => [...acc, ...(state.errors[key] ? [state.errors[key]] : [])],
      [],
    ).length;

    if ((errors && !isEmpty(errors)) || hasFieldErrors) {
      dispatch({ type: 'FORM_VALIDATION', payload: errors });
      dispatch({
        type: 'SUBMIT_FAILED',
        payload: { ...state.errors, ...errors },
      });
    } else {
      try {
        const normalized = normalize(state.values);
        await onSubmit(normalized);
        dispatch({
          type: 'SUBMIT_SUCCEEDED',
        });
      } catch (error) {
        dispatch({
          type: 'SUBMIT_FAILED',
          payload: error,
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

  useEffect(() => {
    effect({ state, dispatch, change });
  }, [state]);

  // I think this is screwing everything up - this causes several "callbacks"
  // (onSubmit) functions to fire, I've tried to put setStates in. Obviously can't
  // rely on useState and getState within the *same* callback, but it also doesn't
  // work trying to access previous state on a _subsequent_ callback. I think because
  // this useEffect freezes child components' render cycle or something.
  useEffect(() => {
    if (shouldSubmit) {
      submit(state.values);
    }
    return null;
  }, [shouldSubmit]);

  return (
    <FormProvider
      ref={ref}
      value={{
        change,
        validate,
        state,
        submit,
        meta: state.meta,
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
  normalize: f => f,
  shouldSubmit: false,
};

Form.propTypes = {
  initial: shape({}),
  onSubmit: func,
  validate: func,
  effect: func,
  normalize: func,
  children: node,
  shouldSubmit: bool,
};

export default Form;
