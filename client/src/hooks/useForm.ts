import { useState } from 'react';

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
  [index: string]: {
    /**
     * Key/values of the form field > values
     */
    [index: string]: string | number;
  };
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
}
const formStore: FormStore = {};

/**
 * Custom hook that produces getters and setters for a form key
 *
 * @export
 * @param {string} formName
 * @returns Functions and values specific to the form described in the argument
 */
export default function useForm(formName: string) {
  const [forms, setForms] = useState({
    ...formStore,
    [formName]: formStore[formName] || {},
  });

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
        [field]: value,
      },
    };
    setForms(newFormState);
  }

  /**
   * Function that produces props for input components
   *
   * @param {UseField} { field, handleChange }
   * @returns onChange callabck handler and value
   */
  function useField({ field, handleChange }: UseField) {
    return {
      onChange: handleChange
        ? (arg0: any) => {
            const value = handleChange(arg0);
            setValue(field, value);
          }
        : (e: React.ChangeEvent<HTMLInputElement>) =>
            setValue(field, e.target.value),
      value: forms[formName][field] || '',
    };
  }
  return { useField, setValue, form: forms[formName] };
}
