import useRouter from 'hooks/useRouter';
import * as React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { PostsWithTagsWithFakes } from 'hooks/usePosts';

interface UsePostLink {
  /* tslint:disable-next-line no-any */
  Element: any;
  props:
    | {
        to: string;
      }
    | {};
}

const usePostLink = (post: PostsWithTagsWithFakes): UsePostLink => {
  const { location } = useRouter();
  const galleryLinkPrefix = location.pathname.endsWith('/')
    ? location.pathname
    : `${location.pathname}/`;

  const galleryLink = `${galleryLinkPrefix}gallery/${
    post.id ? post.id.split('-')[0] : ''
  }`;

  const isGallery = location.pathname.includes('gallery');
  /* tslint:disable-next-line no-any */
  let Element = React.Fragment as any;
  let props = {};

  if (!isGallery) {
    Element = Link as typeof Link;
    props = {
      to: galleryLink,
    };
  }
  return { Element, props };
};

export default usePostLink;
