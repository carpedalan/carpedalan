import { default as styled } from 'styled-components';

import { DANGER_COLOR, getThemeValue } from './utils';

export default styled.div`
  color: ${getThemeValue(DANGER_COLOR)};
`;
