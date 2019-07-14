import * as React from 'react';

export type User = 'read' | 'write' | undefined;
const user: User = window.__SESSION__ ? window.__SESSION__.user : undefined;
const { createContext, Children, useState } = React;

type SetUser = (u: User) => void;
export interface IUserContext {
  user: User;
  setUser: SetUser;
}
export const UserContext = createContext<IUserContext>({
  user,
  setUser: () => {},
});

export const UserConsumer = UserContext.Consumer;

export const UserProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [userState, setUser] = useState<User>(user);
  const value: IUserContext = {
    setUser,
    user: userState,
  };
  return (
    <UserContext.Provider value={value}>
      {Children.only(children)}
    </UserContext.Provider>
  );
};
