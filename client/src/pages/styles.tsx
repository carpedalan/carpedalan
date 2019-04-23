import { default as styled } from 'styled-components';

import { BRAND_COLOR, getThemeValue, MAIN, prop } from '../styles';

import Title from '../styles/Title';

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
export const InputForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  max-height: 25em;
  width: 80vw;
  height: 80vh;
  input {
    text-align: center;
  }
`;

export const StyledTitle = styled(Title)`
  margin: 0;
`;

export const StyledButton = styled.button`
  color: ${getThemeValue(BRAND_COLOR)};
  background: ${getThemeValue(MAIN)};
  border: none;
  padding: 1em 3em;
  cursor: pointer;
  outline: inherit;
`;
