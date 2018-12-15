import { createGlobalStyle } from 'styled-components';

export const MAIN = 'main';
export const TEXT = 'text';
export const getThemeValue = value => ({ theme }) => theme[value];

export const GlobalStyleComponent = createGlobalStyle`
  body {
    background: ${getThemeValue(MAIN)}; 
    color: ${getThemeValue(TEXT)};
    width: 100%;
    padding: 0;
    margin: 0;
  }
`;

const dark = {
  [MAIN]: 'black',
  [TEXT]: 'white',
};

const lite = {
  [MAIN]: 'white',
  [TEXT]: 'black',
};

export const themes = {
  dark,
  lite,
};
