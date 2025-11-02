// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { login, logout } from "../api/auth";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const handleLogin = async (username, password) => {
    await login(username, password);
    await fetchCurrentUser();
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get("reviews/me/");
      setUser(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("access")) {
      fetchCurrentUser();
    } else {
      window.location.href = "/login";
    }

  }, []);

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
