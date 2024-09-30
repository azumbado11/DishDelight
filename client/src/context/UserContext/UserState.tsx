import React, { createContext, useState } from "react";
import { User } from "../../types/user";

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

type UserStateProps = {
  children: React.ReactNode;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

const UserState: React.FC<UserStateProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserState;
