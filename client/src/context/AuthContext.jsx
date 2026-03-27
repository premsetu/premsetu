import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/axios";
import { disconnectSocket } from "../utils/socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("premsetu_token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get("/profile/me");
      setUser(data.user);
    } catch (error) {
      localStorage.removeItem("premsetu_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (payload, endpoint = "/auth/login") => {
    const { data } = await api.post(endpoint, payload);
    localStorage.setItem("premsetu_token", data.token);
    await fetchCurrentUser();
    return data;
  };

  const logout = () => {
    localStorage.removeItem("premsetu_token");
    disconnectSocket();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        logout,
        refreshUser: fetchCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
