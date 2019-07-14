import { PostsWithTagsWithFakes } from 'hooks/usePosts';
import { bool, func, node, number, oneOf, shape, string } from 'prop-types';
import * as React from 'react';
import { default as styled } from 'styled-components';
import { getFullImageSrcSet, getSquareImageSrcSet } from 'utils';

// import { propTrueFalse } from '../styles';

const Wrapper = styled.div`
  display: inline-block;
  margin-bottom: -4px;
`;

const StyledPicture = styled.picture`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

interface PictureInterface {
  shouldShowImage: boolean;
  width: string;
  ratio: number;
  post: PostsWithTagsWithFakes;
  placeholderColor: string;
  alt: PostsWithTagsWithFakes['description'];
  type: string;
  children?: React.ReactChildren;
}

const Picture = ({
  shouldShowImage,
  width,
  ratio,
  post,
  placeholderColor,
  alt,
  children,
  type,
  ...etc
}: PictureInterface) => (
  <Wrapper
    style={{
      width,
      position: 'relative',
    }}
    {...etc}
  >
    <div
      className="image"
      style={{
        paddingTop: `${ratio * 100}%`,
        position: 'relative',
        backgroundColor: placeholderColor,
      }}
    >
      {shouldShowImage && !post.fake ? (
        <StyledPicture as="picture" data-test={post.key}>
          {type === 'original'
            ? getFullImageSrcSet({ post })
            : getSquareImageSrcSet({ post })}
        </StyledPicture>
      ) : null}
      {children}
    </div>
  </Wrapper>
);

export default Picture;
