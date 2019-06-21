import { default as styled } from 'styled-components';

import { prop } from './utils';

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
  align-items: center;
  justify-content: ${props => props.justifyContent};
`;

FlexContainer.defaultProps = {
  justifyContent: FlexEnums.center,
  alignItems: FlexEnums.center,
};

export default FlexContainer;
