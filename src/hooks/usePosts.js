import { useContext, useState } from 'react';
import { stringify } from 'qs';
import { CellMeasurerCache } from 'react-virtualized/dist/es/CellMeasurer';

import { API_PATH, DEFAULT_POSTS_PER_PAGE } from '../../shared/constants';
import log from '../utils/log';
import { performance } from '../utils/globals';
import { API } from '../providers/APIProvider';
import { Window } from '../providers/WindowProvider';
import addPlaceholderColor from '../providers/postUtils';

const addFakePosts = ({ posts, meta }) => {
  const allFakes = [...Array(meta.count).keys()]
    .map(() => ({ fake: true, tags: [] }))
    .map(addPlaceholderColor);

  const postsWithFakes = Object.keys(posts).reduce((acc, key) => {
    const fakesWithPosts = acc.map((fake, index) => {
      if (
        Number(key) * DEFAULT_POSTS_PER_PAGE <= index &&
        (Number(key) + 1) * DEFAULT_POSTS_PER_PAGE > index
      ) {
        return {
          ...fake,
          ...posts[key][index - DEFAULT_POSTS_PER_PAGE * key],
          fake: false,
        };
      }
      return fake;
    });
    return fakesWithPosts;
  }, allFakes);

  return postsWithFakes;
};

const usePosts = () => {
  const { width } = useContext(Window);
  const { patch, get, post, del, posts, setPosts, meta, setMeta } = useContext(
    API,
  );
  const [postsWithFakes, setPostsWithFakes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [progressMap, setProgressMap] = useState({});

  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: width,
  });

  const patchPost = id => async values => {
    try {
      const { body } = await patch(`${API_PATH}/posts/${id}`, values);
      setPostsWithFakes(
        postsWithFakes.map(data => (data.id === body.id ? body : data)),
      );
      cache.clearAll();
    } catch (e) {
      log.error(e);
    }
  };

  const delPost = id => async () => {
    await del(`${API_PATH}/posts/${id}`);
    setPostsWithFakes(postsWithFakes.filter(data => data.id !== id));
    cache.clearAll();
  };

  const getPosts = async (page = currentPage) => {
    try {
      const pageQuery = {
        page,
      };

      // Some super basic caching - don't refetch if we have already.
      if (posts[page - 1]) return null;
      const apiCall = get(`${API_PATH}/posts?${stringify(pageQuery)}`);
      const response = await apiCall;
      const newPosts = {
        ...posts,
        [page - 1]: response.body.data,
      };

      setMeta(response.body.meta);
      setPosts(newPosts);
      setCurrentPage(currentPage + 1);

      const finalPosts = addFakePosts({
        posts: newPosts,
        meta: response.body.meta,
      });

      setPostsWithFakes(finalPosts);
    } catch (e) {
      log.error('loading failed');
    }
    return null;
  };

  const invalidateAll = () => {
    cache.clearAll();
    setPosts({});
    setMeta({ count: 0 });
  };

  const createPost = async (formData, index = 0) => {
    try {
      let afterUploadStart;
      const response = await post(`${API_PATH}/posts`)
        .send(formData)
        .on('progress', e => {
          if (e.percent) {
            setProgressMap({ ...progressMap, [index]: e.percent });
            console.error('progress', e.percent); // eslint-disable-line
            if (e.percent === 100) {
              afterUploadStart = performance.now();
            }
          }
        });
      const timeEnd = performance.now();
      invalidateAll();
      const processTime = timeEnd - afterUploadStart;

      return { response: response.body, processTime };
    } catch (e) {
      log.error(e);
      return Promise.reject(e);
    }
  };

  return {
    cache,
    getPosts,
    posts: postsWithFakes,
    meta,
    patchPost,
    delPost,
    invalidateAll,
    createPost,
    progressMap,
  };
};

export default usePosts;
