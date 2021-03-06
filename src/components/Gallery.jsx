import React, { useContext, useRef } from 'react';
import { arrayOf, func, shape } from 'prop-types';
import styled from 'styled-components';

import NotFound from '../pages/NotFound';
import { Window } from '../providers/WindowProvider';
import FlexContainer from '../styles/FlexContainer';
import { getImageRatio } from '../utils';

import Modal from './Modal';
import Post from './Post';

const Container = styled(FlexContainer)`
  width: 100%;
  height: 100%;
`;

export default function Gallery({ match, data, onClose }) {
  // console.error('props', props);
  const { width, height } = useContext(Window);
  const safeRef = useRef();
  if (!data.length) return null;

  const post = data.find(
    ({ id }) => id && id.split('-')[0] === match.params.id,
  );

  const viewPortAspectRatio = height / width;

  const photoAspectRatio = getImageRatio(post);

  const photoWidth =
    photoAspectRatio > viewPortAspectRatio
      ? `${height / photoAspectRatio - 100}px`
      : '100%';

  return (
    <Modal onClose={onClose} safeRef={safeRef}>
      <Container alignItems="center" justifyContent="center">
        {/* <Inner justifyContent="space-between"> */}
        {!post ? (
          <NotFound />
        ) : (
          <Post
            safeRef={safeRef}
            post={post}
            shouldShowImages
            tags={[]}
            width={photoWidth}
          />
        )}
        {/* </Inner> */}
      </Container>
    </Modal>
  );
}

Gallery.propTypes = {
  data: arrayOf(shape({})).isRequired,
  match: shape({}).isRequired,
  onClose: func,
};

Gallery.defaultProps = {
  onClose: () => {},
};
