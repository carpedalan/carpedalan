import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

import FlexContainer from '../styles/FlexContainer';
import { document } from '../utils/globals';

const Background = styled(FlexContainer)`
  justify-content: center;
  align-items: center;
  position: fixed;
  height: 100%;
  width: 100%;
  background: radial-gradient(
    ellipse at center,
    rgba(100, 100, 100, 0.8) 0%,
    rgba(0, 0, 0, 0.8) 100%
  ); /* w3c */
  z-index: 1;
  top: 0;
  left: 0;
`;

const CloseButton = styled.button`
  position: fixed;
  top: 0;
  right: 0;
  background: black;
  color: white;
  border: none;
  outline: inherit;
  padding: 1em;
  font-size: 16px;
`;

export default function Modal({ children, onClose }) {
  useEffect(() => {
    document.getElementsByTagName('body')[0].classList.add('show-modal');
    return () => {
      document.getElementsByTagName('body')[0].classList.remove('show-modal');
    };
  }, []);

  const backgroundRef = useRef();

  function handleClick(e) {
    if (!backgroundRef.current.contains(e.target)) {
      onClose(e);
    }
  }
  return createPortal(
    <Background onClick={handleClick}>
      <CloseButton onClick={onClose}>✖</CloseButton>
      <div ref={backgroundRef}>{children}</div>
    </Background>,
    document.getElementById('modal'),
  );
}
