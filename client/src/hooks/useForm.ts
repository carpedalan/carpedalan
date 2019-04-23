import { useState } from 'react';

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
  field: string;
  /**
   * Optional handle change if the consumer wants to setup a custom handler
   */
  handleChange?: (arg0: any) => string | number;
}
const formStore: FormStore = {};

export default function useForm(formName: string) {
  const [forms, setForms] = useState({
    ...formStore,
    [formName]: formStore[formName] || {},
  });

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

// export default function useForm() {
//   const [count, setCount] = useState(0);
//   function setCOUNT(num: number) {
//     setCount(num);
//   }
//   return { count, setCount: setCOUNT };
// }
