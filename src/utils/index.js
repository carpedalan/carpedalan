/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';

import {
  SIZE_MAP,
  // SMALL,
  MEDIUM,
  HIRES,
  SMALL_THUMB,
  // LARGE_THUMB,
  TINY,
} from '../../shared/constants';

import { window } from './globals';

export const formatDate = timestamp =>
  format(fromUnixTime(timestamp), 'MMM d YYYY', {
    awareOfUnicodeTokens: true,
  });

const { cdn } = window.__META__; // eslint-disable-line no-underscore-dangle

export const getImagePath = ({ post, size, type = 'jpg', prefix = 'web' }) => {
  const { width, height } = SIZE_MAP[size];
  return post.fake
    ? ''
    : `https://${cdn}/${prefix}/${
        post.key.split('/')[1].split('.')[0]
      }-${width}${height ? `-${height}` : ''}.${type}`;
};

export const getOriginalImagePath = ({ post }) =>
  post.fake ? '' : `https://${cdn}/${post.key}`;

/* eslint-disable react/prop-types */
export const getFullImageSrcSet = ({ post }) => (
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
      srcSet={`${getImagePath({ post, size: MEDIUM, type: 'webp' })}, 
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

export const getSquareImageSrcSet = ({ post }) => (
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

export const getImageRatio = post => {
  if (post.fake) return 1;
  let ratio = post.imageHeight / post.imageWidth;
  if (Number(post.orientation) === 6) ratio = 1 / ratio;
  return ratio;
};
