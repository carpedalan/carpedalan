import React, { useEffect, useRef, useState } from 'react';
import throttle from 'lodash/throttle';
import { arrayOf, func, number, shape, string } from 'prop-types';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import { CellMeasurerCache } from 'react-virtualized/dist/es/CellMeasurer';
import List from 'react-virtualized/dist/es/List';
import InfiniteLoader from 'react-virtualized/dist/es/InfiniteLoader';
import WindowScroller from 'react-virtualized/dist/es/WindowScroller';
import styled from 'styled-components';

import { LARGE_THUMB } from '../../shared/constants';
import usePrevious from '../hooks/usePrevious';
import Button from '../styles/Button';

import BulkEditModal from './BulkEditModal';
import PostGridRowRenderer from './PostGridRowRenderer';

const POST_WIDTH = 100;

const EditButton = styled(Button)`
  position: fixed;
  right: 1em;
  bottom: 1em;
`;

const cache = new CellMeasurerCache({
  defaultHeight: POST_WIDTH,
  defaultWidth: POST_WIDTH,
  fixedWidth: true,
});
let lastValue = 0;
const throttled = throttle((e, setShouldShowImages) => {
  const delta = Math.abs(e.scrollTop - lastValue);
  lastValue = e.scrollTop;
  setShouldShowImages(e.scrollTop < 100 || delta < 1500);
}, 250);

export default function Grid({
  type,
  fetchData,
  data,
  meta,
  match,
  location,
  history,
}) {
  // const stuff = useContext(__RouterContext);
  // console.error('stuff', stuff);

  const [loading, setLoading] = useState(false);
  const [isSelecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState({});
  const [shouldShowImages, setShouldShowImages] = useState(true);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [selectIndex, setSelectIndex] = useState(null);
  const previousSelectedIndex = usePrevious(selectIndex);
  const listRef = useRef(null);

  useEffect(() => {
    fetchData(1);
  }, [type]);

  const isRowLoaded = width => ({ index }) =>
    !!data[index * Math.floor(width / POST_WIDTH)] &&
    !data[index * Math.floor(width / POST_WIDTH)].fake;

  async function loadMoreRows() {
    if (!loading) {
      setLoading(true);
      await fetchData();
      setLoading(false);
    }
  }
  const handleScroll = onChildScroll => e => {
    onChildScroll(e);
    throttled(e, setShouldShowImages);
  };

  const handleSelecting = () => {
    setSelecting(true);
  };

  const handleAddSelect = indexes => () => {
    if (indexes.length === 1) {
      setSelected({
        ...selected,
        [indexes[0]]: selected[indexes[0]] ? false : data[indexes[0]].id,
      });
    } else {
      setSelected({
        ...selected,
        ...indexes.reduce(
          (acc, index) => ({
            ...acc,
            [index]: data[index].id,
          }),
          {},
        ),
      });
    }
  };

  return (
    <WindowScroller>
      {({ height, isScrolling, onChildScroll, registerChild, scrollTop }) => (
        <AutoSizer disableHeight>
          {({ width }) => {
            const postsPerRow = Math.floor(width / POST_WIDTH);
            return (
              <>
                <InfiniteLoader
                  isRowLoaded={isRowLoaded(width)}
                  loadMoreRows={loadMoreRows}
                  rowCount={Math.floor(meta.count / postsPerRow) + 1}
                >
                  {({ onRowsRendered }) => (
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
                        rowRenderer={PostGridRowRenderer({
                          history /* etc for proptype checking */,
                          setSelectIndex,
                          selectIndex,
                          previousSelectedIndex,
                        })}
                        rowCount={Math.floor(data.length / postsPerRow) + 1}
                        overscanRowCount={20}
                        isScrolling={isScrolling}
                        scrollTop={scrollTop}
                        posts={data}
                        cache={cache}
                        size={LARGE_THUMB}
                        showDescription={false}
                        shouldShowImages={shouldShowImages}
                        postsPerRow={postsPerRow}
                        match={match}
                        location={location}
                        isSelecting={isSelecting}
                        setSelecting={handleSelecting}
                        addSelect={handleAddSelect}
                        selected={selected}
                      />
                      {isSelecting ? (
                        <EditButton onClick={() => setShowBulkEditModal(true)}>
                          {`Bulk Edit`}
                        </EditButton>
                      ) : null}
                      {showBulkEditModal ? (
                        <BulkEditModal
                          ids={selected}
                          showBulkModal={setShowBulkEditModal}
                        />
                      ) : null}
                    </div>
                  )}
                </InfiniteLoader>
              </>
            );
          }}
        </AutoSizer>
      )}
    </WindowScroller>
  );
}

Grid.defaultProps = {
  type: null,
};

Grid.propTypes = {
  fetchData: func.isRequired,
  data: arrayOf(shape({ id: string })).isRequired,
  meta: shape({
    count: number.isRequired,
  }).isRequired,
  type: string,
  match: shape({}).isRequired,
  location: shape({}).isRequired,
  history: shape({}).isRequired,
};
