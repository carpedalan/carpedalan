import { useState } from 'react';
import { User } from 'User';

let user = User.none;

interface UserHook {
  setUser: (arg0: User) => void;
  user: User;
}

export default function useUser(): UserHook {
  const [userState, setUser] = useState(user);
  const setGlobalUser = (arg0: User): void => {
    user = arg0;
    setUser(user);
  };
  return { user, setUser: setGlobalUser };
}
