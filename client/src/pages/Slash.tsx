import Feed from 'components/Feed';
import Grid from 'components/Grid';
import debug from 'debug';
import usePosts, { PostsWithTagsWithFakes } from 'hooks/usePosts';
import useRouter from 'hooks/useRouter';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { default as styled } from 'styled-components';
const log = debug('component:Slash');

const { useState, useLayoutEffect } = React;
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

interface RowRender {
  index: number;
  style: React.CSSProperties;
}

const Slash: React.FC = (): React.ReactElement => {
  const { request, posts, loading, response } = usePosts();
  const [postsWithTitle, setPostsWithTitle] = useState<
    PostsWithTagsWithFakes[]
  >(posts);
  const wrapperRef = useRef<HTMLInputElement>(null);

  const {
    location: { hash, pathname },
  } = useRouter();

  function isGrid() {
    return hash.includes('grid');
  }

  useEffect(() => {
    log('%c post dep changed', 'background: blue;');
    const newPosts = [...posts];
    newPosts.unshift({ fake: true, placeholder: '', key: 'title' });
    setPostsWithTitle(newPosts);
  }, [posts]);

  return (
    <>
      <GridListSwitcher>
        <Link to={`${pathname}${hash.includes('grid') ? '' : '#grid'}`}>
          {hash.includes('grid') ? 'List' : 'Grid'}
        </Link>
      </GridListSwitcher>

      <Wrapper data-testid="home" ref={wrapperRef}>
        {isGrid() ? (
          <Grid itemsWithTitle={postsWithTitle} />
        ) : (
          <Feed itemsWithTitle={postsWithTitle} />
        )}
      </Wrapper>
    </>
  );
};

export default Slash;
