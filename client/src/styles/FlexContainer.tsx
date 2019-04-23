import { default as styled } from 'styled-components';

import { prop } from '.';

export enum FlexEnums {
  center = 'center',
  spaceBetween = 'space-between',
}

interface FlexProps {
  justifyContent?: FlexEnums;
  alignItems?: FlexEnums;
}

const FlexContainer =
  styled.div <
  FlexProps >
  `
  display: flex;
  align-items: ${prop('alignItems')};
  justify-content: ${prop('justifyContent')};
`;

FlexContainer.defaultProps = {
  justifyContent: FlexEnums.center,
  alignItems: FlexEnums.center,
};

export default FlexContainer;
