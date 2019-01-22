import React, { useContext, useEffect, useRef, useState } from 'react';
import { arrayOf, func, number, shape } from 'prop-types';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import InfiniteLoader from 'react-virtualized/dist/es/InfiniteLoader';
import List from 'react-virtualized/dist/es/List';
import WindowScroller from 'react-virtualized/dist/es/WindowScroller';
import throttle from 'lodash/throttle';

import { User } from '..';

import { WRITE_USER } from '../../server/constants';
import Button from '../styles/Button';
import FlexContainer from '../styles/FlexContainer';
import Wrapper from '../styles/Wrapper';
import { MEDIUM } from '../../shared/constants';
import { Posts } from '../providers/PostsProvider';
import { Tag } from '../providers/TagProvider';
import Title from '../styles/Title';

import Dialog from './Dialog';
import PostRenderer from './PostRenderer';

let lastValue = 0;
const throttled = throttle((e, setShouldShowImages) => {
  const delta = Math.abs(e.scrollTop - lastValue);
  lastValue = e.scrollTop;
  setShouldShowImages(e.scrollTop < 100 || delta < 1500);
}, 250);

export default function Feed({
  isEditing,
  setEditing,
  posts,
  fetchData,
  meta,
  match,
  location,
}) {
  const { cache, delPost } = useContext(Posts);
  const { tags } = useContext(Tag);
  const { user } = useContext(User);
  const [shouldShowImages, setShouldShowImages] = useState(true);
  const [showModal, setShouldShowModal] = useState(null);
  const listRef = useRef();
  const throttledResize = throttle(() => {
    if (listRef.current) {
      cache.clearAll();
    }
  }, 250);

  const isAdmin = user === WRITE_USER;

  window.addEventListener('resize', throttledResize);
  useEffect(() => {
    fetchData(1);
    return () => window.removeEventListener('resize', throttledResize);
  }, []);

  const setEditingForIndex = index => {
    setEditing(index);
    cache.clear(index);
    listRef.current.recomputeRowHeights(index);
    listRef.current.scrollToRow(isEditing);
  };

  function isRowLoaded({ index }) {
    return !!posts[index] && !posts[index].fake;
  }

  function loadMoreRows() {
    return fetchData();
  }

  const handleScroll = onChildScroll => e => {
    onChildScroll(e);
    throttled(e, setShouldShowImages);
  };

  const handleDelete = index => () => {
    setShouldShowModal(index);
  };

  const handleConfirmDelete = index => () => {
    delPost(index)();
    setShouldShowModal(null);
  };

  return (
    <WindowScroller>
      {({ height, isScrolling, onChildScroll, registerChild, scrollTop }) => (
        <Wrapper>
          <AutoSizer disableHeight>
            {({ width }) => (
              <InfiniteLoader
                isRowLoaded={isRowLoaded}
                loadMoreRows={loadMoreRows}
                rowCount={meta.count}
              >
                {({
                  onRowsRendered /* , registerChild: registerInfiniteChild */,
                }) => (
                  <div ref={registerChild}>
                    <List
                      width={width}
                      height={height}
                      autoHeight
                      ref={listRef}
                      onRowsRendered={onRowsRendered}
                      deferredMeasurementCache={cache}
                      onScroll={handleScroll(onChildScroll)}
                      rowHeight={cache.rowHeight}
                      rowRenderer={PostRenderer}
                      rowCount={meta.count}
                      overscanRowCount={10}
                      isScrolling={isScrolling}
                      scrollTop={scrollTop}
                      posts={posts}
                      cache={cache}
                      shouldShowImages={shouldShowImages}
                      size={MEDIUM}
                      showDescription
                      isAdmin={isAdmin}
                      setEditing={setEditingForIndex}
                      isEditing={isEditing}
                      delPost={handleDelete}
                      tags={tags}
                      match={match}
                      location={location}
                    />
                  </div>
                )}
              </InfiniteLoader>
            )}
          </AutoSizer>
          {showModal ? (
            <Dialog>
              <Title center size="small">
                Are you sure?
              </Title>
              <FlexContainer justifyContent="space-between">
                <Button type="danger" onClick={handleConfirmDelete(showModal)}>
                  Yup
                </Button>
                <Button type="neutral" onClick={() => setShouldShowModal(null)}>
                  Nah
                </Button>
              </FlexContainer>
            </Dialog>
          ) : null}
        </Wrapper>
      )}
    </WindowScroller>
  );
}

Feed.defaultProps = {
  isEditing: null,
};

Feed.propTypes = {
  posts: arrayOf(shape({})).isRequired,
  fetchData: func.isRequired,
  meta: shape({
    count: number,
  }).isRequired,
  isEditing: number,
  setEditing: func.isRequired,
  match: shape({}).isRequired,
  location: shape({}).isRequired,
  // outerRef: object.isRequired, // eslint-disable-line
};
