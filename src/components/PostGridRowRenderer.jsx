import React, { Fragment as F } from 'react';
import { CellMeasurer } from 'react-virtualized';

import { SIZE_MAP } from '../../shared/constants';
import { getImagePath } from '../utils';

import Picture from './Picture';

const RenderRow = props => {
  /* eslint-disable react/prop-types */
  const {
    index,
    key,
    style,
    parent,
    parent: {
      props: { posts, cache, shouldShowImages, size, postsPerRow, onClick },
    },
  } = props;

  const adjustedPostIndex = index * postsPerRow;

  return posts[adjustedPostIndex] ? (
    <CellMeasurer key={key} cache={cache} parent={parent} index={index}>
      <div style={{ ...style }}>
        {[...Array(postsPerRow).keys()].map(subIndex => {
          const postIndex = adjustedPostIndex + subIndex;
          const post = posts[postIndex];

          // for rows with lest then row-length cells
          if (!post) {
            return null;
          }

          const src = getImagePath({ post, size: SIZE_MAP[size] });

          return (
            <F key={postIndex}>
              <Picture
                width={`${100 / postsPerRow}%`}
                ratio={1}
                src={src}
                shouldShowImage={shouldShowImages}
                placeholderColor={post.placeholderColor}
                onClick={onClick(postIndex)}
              />
            </F>
          );
        })}
      </div>
    </CellMeasurer>
  ) : null;
};

export default RenderRow;
