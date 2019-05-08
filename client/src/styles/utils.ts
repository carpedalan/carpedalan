import { createGlobalStyle } from 'styled-components';
interface StyledProp {
  [index: string]: string;
}

export const MAIN = 'main';
export const TEXT = 'text';
export const SIDEBAR_COLOR = 'sidebarColor';
export const BRAND_COLOR = 'brandColor';
export const SECONDARY_COLOR = 'secondaryColor';
export const BODY_FONT = 'bodyFont';
export const TITLE_FONT = 'titleFont';
export const DANGER_COLOR = 'dangerColor';
export const NEUTRAL_COLOR = 'neutralColor';
export const getThemeValue = (value: string) => ({
  theme,
}: {
  theme: StyledProp;
}) => theme[value];

export const prop = (value: string) => (props: StyledProp) => props[value];
export const propTrueFalse = (
  value: string,
  truthy: string,
  falsey: string,
) => (props: StyledProp) => (props[value] ? truthy : falsey);

export const GlobalStyleComponent = createGlobalStyle`
  
  @font-face {
    font-family: 'lobster';
    src: url('https://cdn.carpedalan.com/lobster.woff2') format('woff2'),
         url('https://cdn.carpedalan.com/lobster.woff') format('woff');
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

  html {
  box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
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
  #modal {
    display: none;
  }

  body.show-modal {
    overflow: hidden;
  }

  .show-modal #modal {
    z-index: 1;
    height: 100%;
    width: 100%;
    display: block;
  }
`;

const dark = {
  [BODY_FONT]: `Arial, Helvetica, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
  [MAIN]: 'black',
  [TEXT]: 'white',
  [SIDEBAR_COLOR]: 'rgba(247, 205, 219, 0.8)',
  [BRAND_COLOR]: 'rgb(0, 72, 206)',
  [SECONDARY_COLOR]: '#ff8c0e',
  [TITLE_FONT]: 'montserratregular, Helvetica, sans-serif',
};

const lite = {
  [BODY_FONT]: `Arial, Helvetica, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
  [MAIN]: 'white',
  [TEXT]: '#444',
  [SIDEBAR_COLOR]: 'rgba(247, 205, 219, 0.8)',
  [BRAND_COLOR]: 'rgb(0, 72, 206)',
  [SECONDARY_COLOR]: '#ff8c0e',
  [DANGER_COLOR]: 'rgb(222, 50, 82)',
  [NEUTRAL_COLOR]: 'rgb(100, 100, 100)',
  [TITLE_FONT]: 'montserratregular, Helvetica, sans-serif',
};

export const themes = {
  dark,
  lite,
};
