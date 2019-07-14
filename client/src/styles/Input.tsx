import { default as styled } from 'styled-components';

import { BODY_FONT, getThemeValue } from './utils';

export default styled.div`
  margin: 1em 0;
  width: 50%;
  input {
    width: 100%;
    padding: 12px;
    border: 1px solid hsl(0, 0%, 80%);
    font-size: 16px;
    font-family: ${getThemeValue(BODY_FONT)};
    border-radius: 4px;
  }
`;
