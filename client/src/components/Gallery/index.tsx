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
import { PostsWithTagsWithFakes } from 'hooks/useTagPosts';
import usePosts from 'hooks/usePosts';
import debug from 'debug';

const log = debug('components:Gallery');

const { useRef } = React;

const { center } = FlexEnums;

const Container = styled(FlexContainer)`
  width: 100%;
  height: 100%;
`;

interface GalleryI extends RouteComponentProps<{ postId: string }> {
  onClose: onClose;
}

const Gallery: React.FC<GalleryI> = ({ match, onClose }) => {
  const { width, height } = useWindow();
  const safeRef = useRef(null);
  const { posts } = usePosts();
  log('posts', posts);
  if (!posts.length) return null;

  const post = posts.find(({ id }) => {
    if (id) {
      return id.split('-')[0] === match.params.postId;
    }
    return false;
  });

  if (!post) return null;

  const viewPortAspectRatio = height / width;

  const photoAspectRatio = getImageRatio(post);

  const photoWidth =
    photoAspectRatio > viewPortAspectRatio
      ? `${height / photoAspectRatio - 100}px`
      : '100%';

  return (
    <Modal onClose={onClose} safeRef={safeRef}>
      <Container alignItems={center} justifyContent={center}>
        <Post safeRef={safeRef} post={post} width={photoWidth} />
      </Container>
    </Modal>
  );
};

export default Gallery;
