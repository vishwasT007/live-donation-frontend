// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("mandalUser")) || null
  );

  const login = (data) => {
    const { token, user: userInfo } = data;

    // You can also decode token if needed for extra verification
    // const decoded = jwtDecode(token);

    const userData = {
      token,
      username: userInfo.username,
      name: userInfo.name,
      role: userInfo.role,
      id: userInfo.id,
    };

    localStorage.setItem("mandalUser", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("mandalUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
