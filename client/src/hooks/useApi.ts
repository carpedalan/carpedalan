import { useRef, useState } from 'react';

/**
 * Custom hook to manage error and loading states throughout an APIs
 * execution lifecycle
 *
 * @export
 * @template T
 * @template U
 * @param {((args: T) => Promise<U>)} action
 * @returns
 */
export default function useApi<T, U>(action: ((args: T) => Promise<U>)) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Components.Schemas.Error | null>(null);
  const [response, setResponse] = useState<U>();
  const retry = useRef(() => {});

  async function request(arg: T) {
    try {
      const trial = () => action(arg);
      retry.current = trial;
      setLoading(true);
      const res = await action(arg);
      setLoading(false);
      setResponse(res);
    } catch (e) {
      setLoading(false);
      setError(e);
    }
  }
  return { loading, request, error, response, retry: retry.current };
}
