// // src/context/AuthContext.jsx
// import { createContext, useContext, useState } from "react";
// import { jwtDecode } from "jwt-decode";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(
//     JSON.parse(localStorage.getItem("mandalUser")) || null
//   );

//   const login = (data) => {
//     const { token, user: userInfo } = data;

//     // You can also decode token if needed for extra verification
//     // const decoded = jwtDecode(token);

//     const userData = {
//       token,
//       username: userInfo.username,
//       name: userInfo.name,
//       role: userInfo.role,
//       id: userInfo.id,
//     };

//     localStorage.setItem("mandalUser", JSON.stringify(userData));
//     setUser(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem("mandalUser");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage when app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("mandalUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Invalid user in localStorage:", err);
        localStorage.removeItem("mandalUser");
      }
    }
  }, []);

  // 🟢 Login and store user data + token
  const login = (data) => {
    const { token, user: userInfo } = data;

    const userData = {
      token,
      username: userInfo.username,
      name: userInfo.name,
      role: userInfo.role,
      id: userInfo.id || userInfo._id, // support both `id` and `_id`
    };

    localStorage.setItem("mandalUser", JSON.stringify(userData));
    setUser(userData);
  };

  // 🔴 Logout and clear session
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

// Export hook for easy usage
export const useAuth = () => useContext(AuthContext);
