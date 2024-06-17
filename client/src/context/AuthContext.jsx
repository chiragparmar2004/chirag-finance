import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  console.log(localStorage.getItem("user"));
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );
  console.log("currentUser", currentUser);

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
        currentUser: currentUser?.userInfo || null, // Optional chaining here
        updateUser,
        userToken: currentUser?.token || null, // Optional chaining here
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
