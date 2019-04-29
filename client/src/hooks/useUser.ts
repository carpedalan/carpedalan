import { useState } from 'react';

export type User = 'read' | 'write' | undefined;
let user: User = undefined;
/**
 * Interface for setting and getting global user object
 * @exports
 * @interface UserHook
 */
interface UserHook {
  /**
   * Set the global user
   *
   * @memberof UserHook
   */
  setUser: (arg0: User) => void;

  /**
   *
   * Get the Global user
   *
   * @type {User}
   * @memberof UserHook
   */
  user: User;
}

/**
 * Custom hook that provides the client with a global setter
 * and getter for the global user.
 *
 * @export
 * @returns {UserHook}
 */
export default function useUser(): UserHook {
  const [userState, setUser] = useState(user);
  const setGlobalUser = (arg0: User): void => {
    user = arg0;
    setUser(user);
  };
  return { user, setUser: setGlobalUser };
}
