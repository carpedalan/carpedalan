import { createGlobalStyle } from 'styled-components';

export const MAIN = 'main';
export const TEXT = 'text';
export const SIDEBAR_COLOR = 'sidebarColor';
export const BRAND_COLOR = 'brandColor';
export const SECONDARY_COLOR = 'secondaryColor';
export const BODY_FONT = 'bodyFont';
export const TITLE_FONT = 'titleFont';
export const getThemeValue = value => ({ theme }) => theme[value];
export const prop = value => props => props[value];
export const propTrueFalse = (value, truthy, falsey) => props =>
  props[value] ? truthy : falsey;

export const GlobalStyleComponent = createGlobalStyle`
  
  @font-face {
    font-family: 'england';
    src: url('https://cdn.carpedalan.com/england-webfont.woff2') format('woff2'),
         url('https://cdn.carpedalan.com/england-webfont.woff') format('woff');
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: 'montserratregular';
    src: url('https://cdn.carpedalan.com/montserrat-regular-webfont.woff2') format('woff2'),
         url('https://cdn.carpedalan.com/montserrat-regular-webfont.woff') format('woff');
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: 'SourceSans';
    src: url('https://cdn.carpedalan.com/source-sans-variable.woff2') format('woff2-variations');
  }

  body, html, #root {
    background: ${getThemeValue(MAIN)}; 
    color: ${getThemeValue(TEXT)};
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    font-family: ${getThemeValue(BODY_FONT)};
    font-variation-settings: 'wght' 387, 'wdth' 90;
  }

  #root {
    margin-top: 0;
  }  
`;

const dark = {
  [BODY_FONT]: `SourceSans, Arial, Helvetica, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
  [MAIN]: 'black',
  [TEXT]: 'white',
  [SIDEBAR_COLOR]: 'rgba(0, 255, 231, 0.8)',
  [BRAND_COLOR]: 'rgb(0, 161, 255)',
  [SECONDARY_COLOR]: '#ff8c0e',
  [TITLE_FONT]: 'montserratregular, Helvetica, sans-serif',
};

const lite = {
  [BODY_FONT]: `SourceSans, Arial, Helvetica, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
  [MAIN]: 'white',
  [TEXT]: 'black',
  [SIDEBAR_COLOR]: 'rgba(0, 255, 231, 0.8)',
  [BRAND_COLOR]: 'rgb(0, 161, 255)',
  [SECONDARY_COLOR]: '#ff8c0e',
  [TITLE_FONT]: 'montserratregular, Helvetica, sans-serif',
};

export const themes = {
  dark,
  lite,
};
