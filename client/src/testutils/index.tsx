import * as React from 'react';
import { mount } from 'enzyme';

/* tslint:disable no-any */
const TestHook = ({ callback }: { callback: (...args: any[]) => any }) => {
  callback();
  return null;
};

export const testHook = (callback: (...args: any[]) => any): void => {
  mount(<TestHook callback={callback} />);
};

export const tick = () => new Promise(resolve => setTimeout(resolve, 0));
