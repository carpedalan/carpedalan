import React, { createContext, useState } from 'react';
import { node } from 'prop-types';
import { CellMeasurerCache } from 'react-virtualized/dist/es/CellMeasurer';
import request from 'superagent';

import { API_PATH } from '../../shared/constants';
import log from '../utils/log';

import addPlaceholderColor from './postUtils';

export const TagPosts = createContext({
  posts: [],
  getPosts: () => {},
  meta: {},
});

const TagPostsProvider = ({ children }) => {
  const [tagPosts, setTagPosts] = useState([]);
  const [meta, setMeta] = useState({ count: 0 });
  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 500,
  });
  const clearTags = () => {
    setTagPosts([]);
    setMeta({ count: 0 });
  };
  const getTagPosts = async tag => {
    try {
      const apiCall = request.get(`${API_PATH}/tags/${tag}`);
      const response = await apiCall;
      setTagPosts(response.body.data.map(addPlaceholderColor));
      setMeta(response.body.meta);
    } catch (e) {
      log.error(e);
      log.error('loading failed');
    }
    return null;
  };

  return (
    <TagPosts.Provider
      value={{ cache, getTagPosts, tagPosts, meta, clearTags }}
    >
      {children}
    </TagPosts.Provider>
  );
};

TagPostsProvider.propTypes = {
  children: node.isRequired,
};

export default TagPostsProvider;
