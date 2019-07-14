import debug from 'debug';
import throttle from 'lodash/throttle';
import * as React from 'react';
const { useEffect, useState } = React;

const windowDebug = debug('hooks:window');

const useWindow = () => {
  const [width, setWidth] = useState(window.innerWidth);
  function setWindow() {
    requestAnimationFrame(() => {
      windowDebug('Setting width to', window.innerWidth);
      setWidth(window.innerWidth);
    });
  }

  const throttledSetWindow = throttle(setWindow, 300);
  useEffect(() => {
    window.addEventListener('resize', throttledSetWindow);
    return () => window.removeEventListener('resize', throttledSetWindow);
  }, []);
  return { width };
};

export default useWindow;
