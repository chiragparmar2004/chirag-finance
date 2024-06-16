import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  console.log(localStorage.getItem("user"));
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  const updateUser = (data) => {
    setCurrentUser(data);
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("user");
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser: currentUser.userInfo ? currentUser.userInfo : null,
        updateUser,
        userToken: currentUser.token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
