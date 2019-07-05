import * as React from 'react';
import { createPortal } from 'react-dom';
import { default as styled } from 'styled-components';

import FlexContainer from 'styles/FlexContainer';

const { useEffect } = React;

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

export type onClose = (e: React.MouseEvent<HTMLElement>) => void;

interface ModalI {
  children?: React.ReactNode;
  onClose: onClose;
  safeRef: React.MutableRefObject<HTMLElement | null>;
}

const Modal = ({ children, onClose, safeRef }: ModalI) => {
  useEffect(() => {
    document.getElementsByTagName('body')[0].classList.add('show-modal');
    return () => {
      document.getElementsByTagName('body')[0].classList.remove('show-modal');
    };
  }, []);

  function handleClick(e: React.MouseEvent<HTMLElement>) {
    if (safeRef.current && !safeRef.current.contains(e.currentTarget)) {
      onClose(e);
    }
  }

  const portalElement = document.getElementById('modal');
  if (portalElement) {
    return createPortal(
      <Background data-test="background" onClick={handleClick}>
        <CloseButton data-test="closeModal" onClick={onClose}>
          ✖
        </CloseButton>
        {children}
      </Background>,
      portalElement,
    );
  }
  return null;
};

export default Modal;
