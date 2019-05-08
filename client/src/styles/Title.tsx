import { css, default as styled } from 'styled-components';

import { getThemeValue, TITLE_FONT } from './utils';

enum Sizes {
  large,
  small,
}

interface TitleProps {
  size?: Sizes;
  center?: boolean;
}

export default styled.h1 <
  TitleProps >
  `
  font-family: ${getThemeValue(TITLE_FONT)};
  margin: 2em 0;
  font-size: ${({ size }) => {
    switch (size) {
      case Sizes.large:
        return '42px';
      case Sizes.small:
        return '18px';
      default:
        return '24px';
    }
  }};
  text-transform: uppercase;
  letter-spacing: 5px;
  ${({ center }) =>
    center
      ? css`
          text-align: center;
        `
      : null};
`;
