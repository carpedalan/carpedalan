import React, { useEffect, useState } from 'react';
import { bool, func, number, string } from 'prop-types';
import styled from 'styled-components';

import { propTrueFalse } from '../styles';

const Wrapper = styled.div`
  display: inline-block;
  margin-bottom: -4px;
`;

const Img = styled.img`
  position absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: ${propTrueFalse('loaded', 1, 0)};
  transition: opacity 250ms ease-out;
`;

Img.defaultProps = {
  loaded: false,
};

const Picture = ({
  shouldShowImage,
  width,
  ratio,
  src,
  placeholderColor,
  alt,
  onClick,
}) => {
  const [loaded, setLoaded] = useState(false);
  const preload = new Image();
  preload.onload = () => {
    setLoaded(true);
  };
  preload.src = src;

  return (
    <Wrapper
      style={{
        width,
        backgroundColor: placeholderColor,
      }}
      onClick={onClick}
    >
      <div
        className="image"
        style={{
          paddingTop: `${ratio * 100}%`,
          position: 'relative',
        }}
      >
        {shouldShowImage ? (
          <Img loaded={loaded} src={loaded ? src : ''} alt={alt || src} />
        ) : null}
      </div>
    </Wrapper>
  );
};

Picture.defaultProps = {
  shouldShowImage: true,
  alt: undefined,
  onClick: () => {},
};

Picture.propTypes = {
  src: string.isRequired,
  shouldShowImage: bool,
  ratio: number.isRequired,
  width: string.isRequired,
  placeholderColor: string.isRequired,
  alt: string,
  onClick: func,
};

export default Picture;
