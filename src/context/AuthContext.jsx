import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  const loginUser = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const fetchUser = async () => {
    try {
      const res = await api.get("/users/me");
      setUser(res.data);
    } catch {
      logoutUser();
    }
  };

  useEffect(() => {
    if (token) fetchUser();
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, setUser, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;