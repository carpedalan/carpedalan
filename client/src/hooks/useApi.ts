import get from 'lodash/get';
import { stringify } from 'qs';
import { useContext, useState } from 'react';
import * as req from 'superagent';

/**
 * Custom hook to manage error and loading states throughout an APIs
 * execution lifecycle
 *
 * @export
 * @param {((...args: any[]) => Promise<any>)} action
 * @returns
 */
export default function useApi<T>(action: ((...args: any[]) => Promise<T>)) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Components.Schemas.Error | null>(null);
  const [response, setResponse] = useState<T>();

  /**
   * Function that executes the api initialized function wrapped with
   * state side effects. Forwards all arguments.
   *
   * @param {...any[]} args
   */
  async function request(...args: any[]) {
    try {
      setLoading(true);
      const res = await action(...args);
      console.log(res);
      setResponse(res);
    } catch (e) {
      console.log(e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }
  return { loading, request, error, response };
}
