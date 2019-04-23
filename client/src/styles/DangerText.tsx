import { default as styled } from 'styled-components';

import { DANGER_COLOR, getThemeValue } from '.';

export default styled.div`
  color: ${getThemeValue(DANGER_COLOR)};
`;
