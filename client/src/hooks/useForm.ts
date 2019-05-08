import { useEffect, useState } from 'react';

interface FormInstance {
  values: {
    /**
     * Key/values of the form field > values
     */
    [index: string]: string | number;
  };
  errors: {
    /**
     * Key/values of the form field > errors
     */
    [index: string]: string;
  };
  /**
   * Meta form information
   *
   * @type {{
   *     dirty: boolean;
   *     hasSubmitted: boolean;
   *     submitFailed: boolean;
   *     submitSucceeded: boolean;
   *   }}
   * @memberof FormInstance
   */
  meta: {
    dirty: boolean;
    hasSubmitted: boolean;
    submitFailed: boolean;
    submitSucceeded: boolean;
  };
}
/**
 * "Store" containing all forms and their contents
 * @example
 * ```json
{
  form1: {
    field: 'something',
    checkbox: false,
  }
}
```
 *
 * @interface FormStore
 */
interface FormStore {
  /**
   * The nanme (key) of the form
   */
  [index: string]: FormInstance;
}

interface UseField {
  /**
   * Field in the form for which methods and values will be provided
   *
   * @type {string}
   * @memberof UseField
   */
  field: string;
  /**
   * Optional change handler, meant to be used as a change handler on an input
   * @example
   * ```
const handleChange = (e) => {
  return e.target.value
}
// later
const input = useField({ handleChange, field: 'input' });
<input {...input} />
      ```
   *
   * @param arg0 - Any handler that would be supplied by an onChange
   * @returns The value that will be set on the field.
   *
   */
  handleChange?: (...args: any) => string | number;
  /**
   * validate function.
   * @type {function}
   * @memberof UseField
   */
  validate?: (value: string | number) => string | false;
}
let formStore: FormStore = {};

const defaultState: FormInstance = {
  values: {},
  errors: {},
  meta: {
    dirty: false,
    hasSubmitted: false,
    submitFailed: false,
    submitSucceeded: false,
  },
};

/**
 * Custom hook that produces getters and setters for a form key
 *
 * @export
 * @param {string} formName
 * @returns Functions and values specific to the form described in the argument
 */
export default function useForm(formName: string) {
  const [forms, setForms] = useState<FormStore>({
    ...formStore,
    [formName]: formStore[formName] || (defaultState as FormInstance),
  });
  formStore = {
    ...formStore,
    [formName]: formStore[formName] || (defaultState as FormInstance),
  };

  useEffect(() => {
    formStore = forms;
  }, []);

  /**
   * Function used for setting a value on a given field for the form
   * specified in the hook initializer
   *
   * @param {string} field
   * @param {(string | number)} value
   */
  function setValue(field: string, value: string | number): void {
    const newFormState = {
      ...formStore,
      [formName]: {
        ...formStore[formName],
        values: {
          ...(formStore[formName] ? formStore[formName].values : {}),
          [field]: value,
        },
      },
    };
    formStore = newFormState;
    setForms(newFormState);
  }

  function setError(field: string, value: string): void {
    const newFormState = {
      ...formStore,
      [formName]: {
        ...formStore[formName],
        errors: {
          ...(formStore[formName] ? formStore[formName].errors : {}),
          [field]: value,
        },
      },
    };
    formStore = newFormState;
    setForms(newFormState);
  }

  function removeError(field: string): void {
    delete formStore[formName].errors[field];
    setForms(formStore);
  }

  /**
   * Function that produces props for input components
   *
   * @param {UseField} { field, handleChange }
   * @returns onChange callabck handler and value
   */
  function useField({ field, handleChange, validate = f => false }: UseField) {
    return {
      onChange: handleChange
        ? (arg0: any) => {
            const value = handleChange(arg0);
            const isInvalid = validate(value);
            if (isInvalid) {
              setError(field, isInvalid);
            } else {
              removeError(field);
            }
            setValue(field, value);
          }
        : (e: React.ChangeEvent<HTMLInputElement>) => {
            const isInvalid = validate(e.target.value);
            if (isInvalid) {
              setError(field, isInvalid);
            } else {
              removeError(field);
            }

            setValue(field, e.target.value);
          },

      value: formStore[formName].values[field] || '',
      error: formStore[formName].errors[field],
    };
  }
  return { useField, setValue, form: formStore[formName] };
}
