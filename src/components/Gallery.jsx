import React from 'react';
import { arrayOf, shape } from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { HIRES, SIZE_MAP } from '../../shared/constants';
import NotFound from '../pages/NotFound';
import FlexContainer from '../styles/FlexContainer';
import Title from '../styles/Title';
import { formatDate, getImagePath, getImageRatio } from '../utils';

import Modal from './Modal';
import Picture from './Picture';

const SIZE = SIZE_MAP[HIRES];

const Container = styled(FlexContainer)`
  width: 100%;
  height: 100%;
`;

const Inner = styled(FlexContainer)`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const Caption = styled(FlexContainer)`
  justify-content: space-between;
  padding: 1em 1em;
  background: white;
  width: 100%;
  > * {
    padding: 0 1em;
  }
`;

const StyledTitle = styled(Title)`
  margin: 0;
`;

export default function Gallery({ match, data }) {
  // console.error('props', props);
  if (!data.length) return null;

  const post = data.find(({ id }) => id.split('-')[0] === match.params.id);

  return (
    <Link to={match.params[0]}>
      <Modal>
        <Container alignItems="center" justifyContent="center">
          <Inner justifyContent="space-between">
            {!post ? (
              <NotFound />
            ) : (
              <>
                <Picture
                  width="100%"
                  ratio={getImageRatio(post)}
                  src={getImagePath({ post, size: SIZE })}
                  shouldShowImage
                  placeholderColor={post.placeholderColor}
                />
                <Caption justifyContent="space-between">
                  <div>{post.description}</div>
                  <StyledTitle size="small">
                    {formatDate(post.timestamp)}
                  </StyledTitle>
                </Caption>
              </>
            )}
          </Inner>
        </Container>
      </Modal>
    </Link>
  );
}

Gallery.propTypes = {
  data: arrayOf(shape({})).isRequired,
  match: shape({}).isRequired,
};
