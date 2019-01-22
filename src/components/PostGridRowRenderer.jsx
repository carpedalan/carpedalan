import React, { Fragment, useEffect, useState } from 'react';
import CellMeasurer from 'react-virtualized/dist/es/CellMeasurer';
import styled from 'styled-components';

import usePrevious from '../hooks/usePrevious';
import useUser from '../hooks/useUser';
import { performance, window } from '../utils/globals';

import Picture from './Picture';

const SuccessContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 255, 0.4);
`;

const RenderRow = props => {
  /* eslint-disable react/prop-types */
  const {
    index,
    style,
    parent,
    history,
    setSelectIndex,
    selectIndex,
    previousSelectedIndex,
    parent: {
      props: {
        posts,
        cache,
        // shouldShowImages,
        postsPerRow,
        match,
        location,
        isSelecting,
        setSelecting,
        addSelect,
        selected,
      },
    },
  } = props;

  const [mouseDown, setMouseDown] = useState(false);
  const { isAdmin } = useUser();

  const previousMouseDown = usePrevious(mouseDown);
  const adjustedPostIndex = index * postsPerRow;

  const handleMouseDown = clickedIndex => e => {
    e.preventDefault();
    setMouseDown(performance.now());
    e.stopPropagation();
    setSelectIndex(clickedIndex);
  };
  const getGalleryLocation = galIndex =>
    `${match.url === '/' ? '' : match.url}/gallery/${
      posts[galIndex].id.split('-')[0]
    }${location.hash}`;

  useEffect(() => {
    if (isAdmin) {
      const stopContext = e => {
        e.stopPropagation();
        e.preventDefault();
        return false;
      };
      window.addEventListener('contextmenu', stopContext, true);
      if (mouseDown && previousMouseDown) {
        if (mouseDown - previousMouseDown > 250) {
          setSelecting(true);
          addSelect([selectIndex])();
        } else {
          history.push(getGalleryLocation(selectIndex));
        }
      }
      return () => window.removeEventListener('contextmenu', stopContext);
    }
    return null;
  }, [mouseDown]);

  const handleSelect = selectedIndex => e => {
    if (e.shiftKey) {
      addSelect(
        [...Array(selectedIndex - previousSelectedIndex).keys()].map(
          key => key + previousSelectedIndex + 1,
        ),
      )();
    } else {
      addSelect([selectedIndex])();
    }
  };

  return posts[adjustedPostIndex] ? (
    <CellMeasurer
      key={posts[adjustedPostIndex]}
      cache={cache}
      parent={parent}
      index={index}
    >
      <div style={{ ...style }}>
        {[...Array(postsPerRow).keys()].map(subIndex => {
          const postIndex = adjustedPostIndex + subIndex;
          const post = posts[postIndex];

          // for rows with lest then row-length cells
          if (!post) {
            return null;
          }
          let picProps = {};
          if (isAdmin) {
            if (isSelecting) {
              picProps = {
                onClick: handleSelect(postIndex),
              };
            } else {
              picProps = {
                onMouseDown: handleMouseDown(postIndex),
                onMouseUp: () => setMouseDown(performance.now()),
              };
            }
          } else {
            picProps = {
              onClick: () => history.push(getGalleryLocation(postIndex)),
            };
          }

          return (
            <Fragment key={postIndex}>
              <Picture
                width={`${100 / postsPerRow}%`}
                ratio={1}
                post={post}
                type="square"
                shouldShowImage
                placeholderColor={post.placeholderColor}
                {...picProps}
              >
                {selected[postIndex] ? <SuccessContainer /> : null}
              </Picture>
            </Fragment>
          );
        })}
      </div>
    </CellMeasurer>
  ) : null;
};

const PostGridRowRenderer = things => props => (
  <RenderRow {...props} {...things} />
);

export default PostGridRowRenderer;
