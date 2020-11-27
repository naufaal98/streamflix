import { User } from 'data/user/user.type';
import React from 'react';
import UserService from 'data/user/user.service';

const initialState: User = {
  balance: 0,
  purchased_movies: [],
};

type UserContextType = {
  userData: User;
  syncUserContext: () => void;
};

export const UserContext = React.createContext<UserContextType>({
  userData: initialState,
} as UserContextType);

export const UserProvider: React.FC = ({ children }) => {
  const [userData, setUserData] = React.useState<User>(UserService.getLocalData);

  const syncUserContext = () => {
    setUserData(UserService.getLocalData);
  };

  return (
    <UserContext.Provider value={{ userData, syncUserContext }}>{children}</UserContext.Provider>
  );
};
