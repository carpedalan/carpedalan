import styled from 'styled-components';

import { getThemeValue, BRAND_COLOR, TITLE_FONT, DANGER_COLOR } from '.';

export default styled.button`
  background: ${({ theme, type }) => {
    switch (type) {
      case 'danger':
        return theme[DANGER_COLOR];
      default:
        return theme[BRAND_COLOR];
    }
  }};
  font-family: ${getThemeValue(TITLE_FONT)};
  text-transform: uppercase;
  letter-spacing: 3px;
  color: white;
  border: none;
  padding: 1em 3em;
  cursor: pointer;
  outline: inherit;
  border-radius: 50px;
  :hover {
    filter: brightness(85%);
  }
  :active {
    filter: brightness(125%);
  }
`;
