import get from 'lodash/get';
import { stringify } from 'qs';
import { useContext, useRef, useState } from 'react';
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
  const retry = useRef(() => {});

  /**
   * Function that executes the api initialized function wrapped with
   * state side effects. Forwards all arguments.
   *
   * @param {...any[]} args
   */

  async function request(...args: any[]) {
    try {
      const trial = () => action(...args);
      retry.current = trial;
      setLoading(true);
      const res = await action(...args);
      setLoading(false);
      setResponse(res);
    } catch (e) {
      setLoading(false);
      setError(e);
    }
  }
  return { loading, request, error, response, retry: retry.current };
}
