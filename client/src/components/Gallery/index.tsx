import * as React from 'react';
import { arrayOf, func, shape } from 'prop-types';
import { default as styled } from 'styled-components';

// import NotFound from 'pages/NotFound';
import useWindow from 'hooks/useWindow';
import FlexContainer, { FlexEnums } from 'styles/FlexContainer';
import { getImageRatio } from '../../utils';

import Modal, { onClose } from '../Modal';
import Post from '../Post';
import { RouteComponentProps } from 'react-router-dom';
import usePosts from 'hooks/usePosts';
import debug from 'debug';
import { DataContext } from 'providers/Data';

const log = debug('components:Gallery');

const { useRef, useContext } = React;

const { center } = FlexEnums;

const Container = styled(FlexContainer)`
  width: 100%;
  height: 100%;
`;

interface GalleryI extends RouteComponentProps<{ postId: string }> {}

const Gallery: React.FC<GalleryI> = ({ match, history, location }) => {
  const { width, height } = useWindow();
  const safeRef = useRef(null);

  const {
    data: { postsById },
  } = useContext(DataContext);
  log('posts', postsById);

  const postId = Object.keys(postsById).find(id => {
    if (id) {
      return id.split('-')[0] === match.params.postId;
    }
    return false;
  });

  if (!postId) return null;

  const post = postsById[postId];

  const viewPortAspectRatio = height / width;

  const photoAspectRatio = getImageRatio(post);

  const photoWidth =
    photoAspectRatio > viewPortAspectRatio
      ? `${height / photoAspectRatio - 100}px`
      : '100%';

  const onClose: onClose = e => {
    e.preventDefault();
    log('closing', match, location);
  };

  return (
    <Modal onClose={onClose} safeRef={safeRef}>
      <Container alignItems={center} justifyContent={center}>
        <Post safeRef={safeRef} post={post} width={photoWidth} />
      </Container>
    </Modal>
  );
};

export default Gallery;
