// import format from 'date-fns/format';
// import fromUnixTime from 'date-fns/fromUnixTime';
import { PostsWithTagsWithFakes } from 'hooks/usePosts';
import * as React from 'react';

import {
  HIRES,
  MEDIUM,
  SIZE_MAP,
  Sizes,
  SMALL,
  // LARGE_THUMB,
  SMALL_THUMB,
  TINY,
} from './constants';

// export const formatDate = timestamp =>
//   format(fromUnixTime(timestamp), 'MMM d YYYY', {
//     awareOfUnicodeTokens: true,
//   });

const { cdn } = window.__META__; // eslint-disable-line no-underscore-dangle

interface GetImagePath {
  post: PostsWithTagsWithFakes;
  size: Sizes;
  type: 'jpg' | 'webp';
  prefix?: 'web' | 'original';
}

export const getImagePath = ({
  post,
  size,
  type = 'jpg',
  prefix = 'web',
}: GetImagePath): string => {
  const { width, height } = SIZE_MAP[size];
  return post.fake
    ? ''
    : `https://${cdn}/${prefix}/${
        post.key.split('/')[1].split('.')[0]
      }-${width}${height ? `-${height}` : ''}.${type}`;
};

export const getOriginalImagePath = ({
  post,
}: {
  post: PostsWithTagsWithFakes;
}) => (post.fake ? '' : `https://${cdn}/${post.key}`);

/* eslint-disable react/prop-types */
export const getFullImageSrcSet = ({
  post,
}: {
  post: PostsWithTagsWithFakes;
}): React.ReactElement => (
  <>
    <source
      srcSet={`${getImagePath({ post, size: MEDIUM, type: 'webp' })}, 
  ${getImagePath({ post, size: HIRES, type: 'webp' })} 1.5x,
  ${getImagePath({ post, size: HIRES, type: 'webp' })} 2x`}
      type="image/webp"
      media="(min-width: 768px)"
    />
    <source
      srcSet={`${getImagePath({ post, size: MEDIUM, type: 'jpg' })}, 
  ${getImagePath({ post, size: HIRES, type: 'jpg' })} 1.5x,
  ${getImagePath({ post, size: HIRES, type: 'jpg' })} 2x`}
      type="image/jpg"
      media="(min-width: 768px)"
    />
    <source
      srcSet={`${getImagePath({ post, size: SMALL, type: 'webp' })}, 
  ${getImagePath({ post, size: MEDIUM, type: 'webp' })} 1.5x,
  ${getImagePath({ post, size: MEDIUM, type: 'webp' })} 2x`}
      type="image/webp"
      media="(min-width: 500px)"
    />
    <source
      srcSet={`${getImagePath({ post, size: MEDIUM, type: 'jpg' })}, 
  ${getImagePath({ post, size: MEDIUM, type: 'jpg' })} 1.5x,
  ${getImagePath({ post, size: MEDIUM, type: 'jpg' })} 2x`}
      type="image/jpg"
      media="(min-width: 500px)"
    />
    <source
      srcSet={`${getImagePath({ post, size: TINY, type: 'webp' })},
  ${getImagePath({ post, size: MEDIUM, type: 'webp' })} 1.5x,
  ${getImagePath({ post, size: MEDIUM, type: 'webp' })} 2x`}
      type="image/webp"
      media="(max-width: 499px)"
    />
    <source
      srcSet={`${getImagePath({ post, size: TINY, type: 'jpg' })},
  ${getImagePath({ post, size: MEDIUM, type: 'jpg' })} 1.5x,
  ${getImagePath({ post, size: MEDIUM, type: 'jpg' })} 2x`}
      type="image/jpg"
      media="(max-width: 499px)"
    />
    <img
      src={getImagePath({ post, size: MEDIUM, type: 'jpg' })}
      alt={post.description || post.key}
    />
  </>
);

export const getSquareImageSrcSet = ({
  post,
}: {
  post: PostsWithTagsWithFakes;
}) => (
  <>
    <source
      srcSet={getImagePath({ post, size: SMALL_THUMB, type: 'webp' })}
      type="image/webp"
    />
    <source
      srcSet={getImagePath({ post, size: SMALL_THUMB, type: 'jpg' })}
      type="image/jpg"
    />
    <img
      src={getImagePath({ post, size: SMALL_THUMB, type: 'jpg' })}
      alt={post.description || post.key}
    />
  </>
);

export const getImageRatio = (post: PostsWithTagsWithFakes) => {
  if (post.fake) return 1;
  if (!post.imageHeight || !post.imageWidth) return 1;
  let ratio = Number(post.imageHeight) / Number(post.imageWidth);
  if (Number(post.orientation) === 6) ratio = 1 / ratio;
  return ratio;
};
