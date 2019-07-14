import Picture from 'components/Picture';
import { PostsWithTagsWithFakes } from 'hooks/usePosts';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { default as styled } from 'styled-components';
import FlexContainer, { FlexEnums } from 'styles/FlexContainer';
import {
  BRAND_COLOR,
  formatDate,
  getThemeValue,
  TITLE_FONT,
} from 'styles/utils';
import { getImageRatio, getOriginalImagePath } from 'utils';

const Description = styled.div`
  padding: 1em 1em 0;
  li {
    list-style: none;
    padding: 0;
    display: inline-block;
    margin-right: 0.25em;
  }
  ul {
    margin: 0;
    padding: 0;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${getThemeValue(BRAND_COLOR)};
`;

const HR = styled.div`
  margin-top: 1em;
  display: flex;
  justify-content: center;
  :after {
    border-bottom: 1px solid #999;
    width: calc(100% - 2em);
    content: '';
  }
`;

const Download = styled.a`
  color: ${getThemeValue(BRAND_COLOR)};
  font-family: ${getThemeValue(TITLE_FONT)};
  text-transform: uppercase;
  text-decoration: none;
`;

const Header = styled(FlexContainer)`
  padding: 1em;
`;

const Row = ({
  post,
  isSquare = false,
}: {
  post: PostsWithTagsWithFakes;
  isSquare?: boolean;
}) => {
  return (
    <article>
      <Header justifyContent={FlexEnums.spaceBetween}>
        <Download data-test="date" as="div">
          {post.timestamp ? formatDate(post.timestamp) : null}
        </Download>
        <Download data-test="download" href={getOriginalImagePath({ post })}>
          Download
        </Download>
      </Header>

      <Picture
        width="100%"
        ratio={isSquare ? 1 : getImageRatio(post)}
        post={post}
        shouldShowImage={true}
        placeholderColor={post.placeholder}
        alt={post.description}
        type={isSquare ? 'square' : 'original'}
      />
      <Description>
        {post.description ? (
          <figcaption data-test="description">{post.description}</figcaption>
        ) : null}
        {post.tags && post.tags.length ? (
          <ul>
            {post.tags.map(({ name }, tagIndex) => (
              <li data-test="tags" key={tagIndex}>
                <StyledLink to={`/tag/${name}`}>{`#${name}`}</StyledLink>
              </li>
            ))}
          </ul>
        ) : null}
      </Description>
      <HR />
    </article>
  );
};

export default Row;
