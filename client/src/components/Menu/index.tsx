import { HTMLAttributes } from 'enzyme';
import { default as styled } from 'styled-components';
import Title from 'styles/Title';
import { BRAND_COLOR, prop } from 'styles/utils';

interface IMenu extends HTMLAttributes {
  side: string;
}
const Menu = styled.button<IMenu>`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  cursor: pointer;
  outline: inherit;
  position: fixed;
  z-index: 1;
  top: 0;
  ${prop('side')}: 25px;
  background: rgba(255, 255, 255, 0.6);
  padding: 5px;
  box-shadow: rgba(255, 255, 255, 0.6) 0px 0px 10px 10px;
  border-radius: 40%;
  margin-top: 1em;
`;

export default Menu;
