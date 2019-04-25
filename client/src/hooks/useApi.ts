import get from 'lodash/get';
import { stringify } from 'qs';
import { useContext, useState } from 'react';
import * as req from 'superagent';

// import { Toast } from '../providers/ToastProvider';

const API_PATH = '/v1';

/**
 * Shape of request body for requests. GET requests convert this
 * into a query string, PATCH, POST use this for request body
 *
 * @interface RequestBody
 */
interface RequestBody {
  [index: string]: string | number | string[] | number[];
}

export interface ResponseBody {
  data: RequestBody[];
  meta: {};
}

export const enum HttpMethods {
  get = 'get',
  post = 'post',
  patch = 'patch',
  delete = 'del',
}

/**
 * Custom hook for making a "request object", with a request method
 * and states of said request throughout its lifecycle
 *
 * @export
 * @param {string} route
 * @param {HttpMethods} [method=HttpMethods.get]
 * @returns
 */
export default function useApi(
  route: string,
  method: HttpMethods = HttpMethods.get,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string[] | null>(null);
  const [response, setResponse] = useState<ResponseBody | null>(null);
  // const { addErrorToast } = useContext(Toast);
  /**
   * Actual async function that executes the XHR. Returns the response as a
   * successful promise resolution if the status is 200, rejects if a different status
   * or if there's a network failure. Sets the other properties of the custom hook
   * along the way, like error, loading, and response.
   *
   * @param {RequestBody} body
   * @param {string} [additionalRouteParameter='']
   * @returns {(Promise<ResponseBody | null>)}
   */
  async function request(
    body: RequestBody,
    additionalRouteParameter: string = '',
  ): Promise<ResponseBody | null> {
    try {
      setLoading(true);
      let res;
      if (method === HttpMethods.get) {
        const queryString = body ? `/?${stringify(body)}` : '';
        res = await req[HttpMethods.get](
          `${API_PATH}${route}${additionalRouteParameter}${queryString}`,
        );
      } else {
        res = await req[method](
          `${API_PATH}${route}${additionalRouteParameter}`,
        ).send(body);
      }
      setResponse(res.body);
      return response;
    } catch (e) {
      const { status } = e;
      const errBody = get(e, 'response.body', e);
      setError(errBody);
      // get(errBody, 'errors', []).forEach(err => {
      //   // API is returning a 404 for empty settings when it should return an empty list
      //   if (window.location.pathname.includes('settings') && status === 404) {
      //     return;
      //   }
      //   // addErrorToast(`Error code: ${status}. ${err}`);
      // });
      // This next bit is for the react-final-form API
      // https://github.com/final-form/final-form#onsubmit-values-object-form-formapi-callback-errors-object--void--object--promiseobject--void
      throw new Error('Im an api error');
    } finally {
      setLoading(false);
    }
  }
  return { loading, request, error, response };
}
