import Menu from 'components/Menu';
import Sidebar from 'components/Sidebar';
import * as React from 'react';
import useUser from '../../hooks/useUser';

const { useState } = React;

/**
 * Composite component for Sidebar and Menu, takes no props
 * Controls opening and closing of sidebar, and provides things
 * to the sidebar via hook values
 *
 * @returns {React.ReactElement}
 */
const SidebarAndMenu: React.FC = (): React.ReactElement => {
  const [shouldShowSidebar, setShouldShowSidebar] = useState(false);
  const { user: userState, setUser } = useUser();
  const isLoggedIn = !!userState;

  const toggleMenu = () => setShouldShowSidebar(!shouldShowSidebar);

  return (
    <>
      <Menu data-test="menu" onClick={toggleMenu} type="button" side="left">
        Menu
      </Menu>
      <Sidebar
        isOpen={shouldShowSidebar}
        userState={userState}
        toggleMenu={toggleMenu}
      />
    </>
  );
};

export default SidebarAndMenu;
