import { bool, func, string } from 'prop-types';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { default as styled } from 'styled-components';
import Title from 'styles/Title';
import { getThemeValue, SIDEBAR_COLOR, TEXT } from 'styles/utils';
import { User } from 'User';
import useTags from 'hooks/useTags';
import debug from 'debug';

const log = debug('components:Sidebar');

const { useContext, useEffect } = React;
interface StyledSidebarProps {
  /* tslint:disable-next-line */
  theme: any;
  isOpen?: boolean;
}
const StyledSidebar = styled.div<StyledSidebarProps>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  width: 400px;
  max-width: 80vw;
  top: 0;
  left: ${({ isOpen }) => (isOpen ? 0 : -40)}em;
  z-index: 1;
  background: ${getThemeValue(SIDEBAR_COLOR)};
  height: 100%;
  overflow: scroll;
  transition: left 200ms ease-in;
  font-family: montserratregular;
  padding: ${({ isOpen }) => (isOpen ? `1em` : '1em 0')};
  ${Title} {
    margin-top: 0;
    margin-bottom: 0;
  }
`;

const List = styled.ul`
  margin-left: 0;
  padding-left: 0;
`;

const ListItem = styled.li`
  list-style: none;
  margin-left: 0;
  margin-bottom: 1em;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${getThemeValue(TEXT)};
`;

const Close = styled.button`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  cursor: pointer;
  outline: inherit;
`;

const StyledHelp = styled.a`
  text-decoration: none;
  color: ${getThemeValue(TEXT)};
`;

interface SidebarProps {
  toggleMenu: () => void;
  userState: User;
  isOpen: boolean;
}

export default function sidebar({
  toggleMenu,
  userState,
  isOpen,
}: SidebarProps) {
  const { tags } = useTags();
  log('tags', tags);
  return userState ? (
    <StyledSidebar isOpen={isOpen} onClick={toggleMenu}>
      {tags.map(tag => (
        <li key={tag.id}>
          <Link to={`/tags/${tag.name}`}>{tag.name}</Link>
        </li>
      ))}
      <div>
        <Close type="button" onClick={toggleMenu}>
          Close ✖
        </Close>
        <List>
          {userState === 'write' ? (
            <>
              <ListItem>
                <StyledLink data-test="admin" to="/admin">
                  ADMIN
                </StyledLink>
              </ListItem>
              <ListItem>
                <StyledLink to="/pending">Pending</StyledLink>
              </ListItem>
            </>
          ) : null}

          <ListItem>
            <StyledLink data-test="home" to="/">
              HOME
            </StyledLink>
          </ListItem>

          <ListItem>
            <StyledLink to="/faq">FAQ</StyledLink>
          </ListItem>
        </List>
      </div>
      <StyledHelp href="mailto:leifdalan@gmail.com">Help!</StyledHelp>
      {/* <button type="button" onClick={handleChangeTheme}>
        toggle themeaa
      </button>
      <LogoutButton setUser={setUser} /> */}
    </StyledSidebar>
  ) : null;
}
