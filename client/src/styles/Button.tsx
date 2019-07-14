import { default as styled } from 'styled-components';

import {
  BRAND_COLOR,
  DANGER_COLOR,
  getThemeValue,
  NEUTRAL_COLOR,
  TITLE_FONT,
} from './utils';

export enum ButtonType {
  danger,
  neutral,
}

interface ButtonProps {
  /* tslint:disable-next-line no-any */
  theme: any;
  variant?: ButtonType;
}

export default styled.button<ButtonProps>`
  background: ${({ theme, variant }) => {
    switch (variant) {
      case ButtonType.danger:
        return theme[DANGER_COLOR];
      case ButtonType.neutral:
        return theme[NEUTRAL_COLOR];
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
