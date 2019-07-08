import axios from 'axios';
import Feed from 'components/Feed';
import Grid from 'components/Grid';
import debug from 'debug';
import usePosts, { PostsWithTagsWithFakes, getBg } from 'hooks/usePosts';
import useRouter from 'hooks/useRouter';
import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { default as styled } from 'styled-components';
import useApi from 'hooks/useApi';
import useTags from 'hooks/useTags';
import { DataContext } from 'providers/Data';
const log = debug('component:Tag');

const { useState, useContext } = React;
const InnerWrapper = styled.main`
  max-width: 768px;
  margin: auto;
  height: 100%;
`;

const { useEffect, useRef } = React;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const PostWrapper = styled.article`
  max-width: 620px;
  width: 100%;
  margin: 0 auto;
`;

const GridListSwitcher = styled.div`
  position: fixed;
  z-index: 2;
  top: 0;
  right: 0;
`;

const RowWrapper = styled.div`
  display: flex;
`;

/**
 * API request function
 *
 * @param {string} tagId
 * @returns {Promise<Paths.GetPostsByTag.Responses.$200>}
 */
async function getPostTags(
  tagId: string,
): Promise<Paths.GetPostsByTag.Responses.$200> {
  try {
    const response = await axios.get(`/v1/tags/${tagId}/posts`);
    return response.data;
  } catch (e) {
    if (e.response) throw e.response.data as Components.Schemas.Error;
    throw e as Components.Schemas.Error;
  }
}

/**
 * Tag view. Gets posts by tag based on the route param. Will
 * update view when the route param changes, and make another request
 * @param {RouteComponentProps<{ tagName: string }>} props
 * @returns {React.ReactElement}
 */
const Tag = (
  props: RouteComponentProps<{ tagName: string }>,
): React.ReactElement => {
  const { request, response, loading } = useApi(getPostTags);

  const { addPosts } = useContext(DataContext);

  const { tags } = useTags();

  const [postsWithTitle, setPostsWithTitle] = useState<
    PostsWithTagsWithFakes[]
  >([]);

  const wrapperRef = useRef<HTMLInputElement>(null);

  const gridRef = useRef(0);

  const {
    match: { params },
    location: { hash, pathname },
  } = useRouter();

  function isGrid() {
    return hash.includes('grid');
  }

  /**
   * Add Title to posts list
   */
  useEffect(() => {
    log('%c post dep changed', 'background: blue;');
    if (response) {
      const newPosts = [...response.data];
      newPosts.unshift({ key: props.match.params.tagName });
      const newPostsWithFake = newPosts.map(post => ({
        ...post,
        fake: false,
        placeholder: getBg(),
      }));

      setPostsWithTitle(newPostsWithFake);
      addPosts(newPostsWithFake);
    }
  }, [response]);

  /**
   * Fetch posts by tag when the tags change, or the tagName (route)
   * changes.
   */
  useEffect(() => {
    log('params', props.match.params);
    if (tags.length) {
      const tag = tags.find(tag => tag.name === props.match.params.tagName);
      if (tag && tag.id) {
        request(tag.id);
        gridRef.current += 1;
      }
    }
  }, [tags, props.match.params.tagName]);

  log('loading', loading);

  return (
    <>
      <GridListSwitcher>
        <Link to={`${pathname}${hash.includes('grid') ? '' : '#grid'}`}>
          {hash.includes('grid') ? 'List' : 'Grid'}
        </Link>
      </GridListSwitcher>
      {loading ? (
        'loading'
      ) : (
        <Wrapper data-testid="home" ref={wrapperRef}>
          {isGrid() ? (
            <Grid
              key={props.match.params.tagName}
              itemsWithTitle={postsWithTitle}
            />
          ) : (
            <Feed
              key={props.match.params.tagName}
              itemsWithTitle={postsWithTitle}
            />
          )}
        </Wrapper>
      )}
    </>
  );
};

export default Tag;
