import React, { useContext, useEffect } from 'react';
import { shape } from 'prop-types';

import View from '../components/View';
import { TagPosts } from '../providers/TagPostsProvider';

export default function Tag({ match, location, history }) {
  const { getTagPosts, tagPosts, meta, clearTags, cache } = useContext(
    TagPosts,
  );

  useEffect(() => {
    cache.clearAll();
    clearTags();
    getTagPosts(match.params.tag);
  }, [match.params.tag]);
  const fetchData = () => getTagPosts(match.params.tag);

  return (
    <View
      title={`${match.params.tag}`}
      posts={tagPosts}
      cache={cache}
      fetchData={fetchData}
      meta={meta}
      match={match}
      history={history}
      location={location}
    />
  );
}

Tag.propTypes = {
  match: shape({}).isRequired,
  location: shape({}).isRequired,
  history: shape({}).isRequired,
};
