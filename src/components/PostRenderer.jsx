import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import CellMeasurer from 'react-virtualized/dist/es/CellMeasurer';
import styled from 'styled-components';
import isNumber from 'lodash/isNumber';

import Dropdown from '../fields/Dropdown';
import InputField from '../fields/InputField';
import Field from '../form/Field';
import Submit from '../form/Submit';
import { BRAND_COLOR, getThemeValue, TITLE_FONT } from '../styles';
import Button from '../styles/Button';
import Flex from '../styles/FlexContainer';
import { formatDate, getImageRatio, getOriginalImagePath } from '../utils';

import Picture from './Picture';

const Download = styled.a`
  color: ${getThemeValue(BRAND_COLOR)};
  font-family: ${getThemeValue(TITLE_FONT)};
  text-transform: uppercase;
  text-decoration: none;
`;

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

const Header = styled(Flex)`
  padding: 1em;
`;

const EditButton = styled(Button)`
  position: absolute;
  right: 1em;
  top: 6em;
  z-index: 1;
  opacity: 0.6;
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

const RenderRow = props => {
  /* eslint-disable react/prop-types,no-nested-ternary */
  const {
    index,
    style,
    parent,
    parent: {
      props: {
        posts,
        cache,
        shouldShowImages,
        isEditing,
        delPost,
        setEditing,
        isAdmin,
        tags,
        match,
        location,
      },
    },
  } = props;
  const post = posts[index];

  if (!post) return null;

  const showEditButton =
    isAdmin && (isEditing === index || !isNumber(isEditing));

  const elProps = { key: index };
  let Element = Fragment;
  if (!post.fake) {
    elProps.to = {
      pathname: `${match.url === '/' ? '' : match.url}/gallery/${
        post.id.split('-')[0]
      }`,
      hash: location.hash,
    };
    Element = Link;
  }

  return (
    <CellMeasurer key={index} cache={cache} parent={parent} index={index}>
      <div style={style}>
        <Header justifyContent="space-between">
          <Download as="div">{formatDate(posts[index].timestamp)}</Download>
          <Download href={getOriginalImagePath({ post })}>Download</Download>
        </Header>

        {showEditButton ? (
          <EditButton
            onClick={() => setEditing(isNumber(isEditing) ? null : index)}
          >
            {isEditing === index ? 'Close' : 'Edit'}
          </EditButton>
        ) : null}
        <Element {...elProps}>
          <Picture
            width="100%"
            ratio={getImageRatio(post)}
            post={post}
            shouldShowImage={shouldShowImages}
            placeholderColor={posts[index].placeholderColor}
            alt={posts[index].description}
          />
        </Element>
        {isEditing === index ? (
          <Description>
            <Field name="description" component={InputField} />
            <Field
              name="tags"
              component={Dropdown}
              options={tags.map(tag => ({
                value: tag.id,
                label: tag.name,
              }))}
              isMulti
            />
            <Flex justifyContent="space-between">
              <Submit />
              <Button type="danger" onClick={delPost(posts[index].id)}>
                Delete
              </Button>
            </Flex>
          </Description>
        ) : post.description || (post.tags && post.tags.length) ? (
          <Description>
            {post.description ? (
              <figcaption>{post.description}</figcaption>
            ) : null}
            {post.tags && post.tags.length ? (
              <ul>
                {/* eslint-disable react/no-array-index-key */}
                {post.tags.map(({ name }, tagIndex) => (
                  <li key={tagIndex}>
                    <StyledLink to={`/tag/${name}`}>{`#${name}`}</StyledLink>
                  </li>
                ))}
              </ul>
            ) : null}
          </Description>
        ) : null}
        <HR />
      </div>
    </CellMeasurer>
  );
};

export default RenderRow;
