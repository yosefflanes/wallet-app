import { createContext, useContext, useState } from "react";
import { apiRequest } from "../utils/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null,
  );
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!token;

  const saveAuthData = (userData, accessToken) => {
    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
  };

  const clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("/login", {
        method: "POST",
        body: { email, password },
      });

      const { data, access_token } = response;
      saveAuthData(data, access_token);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("/register", {
        method: "POST",
        body: userData,
      });

      const { data, access_token } = response;
      saveAuthData(data, access_token);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (token) {
        await apiRequest("/logout", { method: "POST" });
      }
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      clearAuthData();
      setIsLoading(false);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line
export const useAuth = () => useContext(AuthContext);
