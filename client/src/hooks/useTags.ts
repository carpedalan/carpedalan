import axios from 'axios';
import debug from 'debug';
import useApi from './useApi';
import { useContext, useEffect } from 'react';
import { DataContext, Data } from 'providers/Data';

const log = debug('hooks:useTags');

/**
 * Get tags API call
 *
 * @returns {(Promise<
 *   Paths.GetTags.Responses.$200 | Components.Schemas.Error
 * >)}
 */
const getTags = async (): Promise<Paths.GetTags.Responses.$200> => {
  try {
    log('gettingTags');
    const response = await axios.get('/v1/tags');
    return response.data;
  } catch (e) {
    if (e.response) throw e.response.data as Components.Schemas.Error;
    throw e as Components.Schemas.Error;
  }
};

/**
 * Return values for useTag hook
 *
 * @interface UseTags
 */
interface UseTags {
  /**
   * Actual tags returned from global data store
   *
   * @type {Data['tags']}
   * @memberof UseTags
   */
  tags: Data['tags'];
  /**
   * Argumentless action to execute fetch tags
   *
   * @memberof UseTags
   */
  fetchTags: (arg?: unknown) => Promise<void>;
}

export default function useTags(): UseTags {
  const { response, request } = useApi(getTags);
  const { setTags, data } = useContext(DataContext);
  useEffect(() => {
    if (response) {
      log('response for set tags, setting', setTags);
      setTags(response);
    }
  }, [response]);

  return {
    tags: data.tags,
    fetchTags: request,
  };
}
