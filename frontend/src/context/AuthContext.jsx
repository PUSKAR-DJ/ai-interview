import { createContext, useState, useEffect } from "react";
import { getProfile, loginUser, logoutUser } from "../api/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const data = await getProfile();
      setUser(data.user);
      return data.user;
    } catch (error) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    await loginUser(credentials);
    return await checkAuth();
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  // FIX: Expose checkAuth as 'refreshUser'
  return (
    <AuthContext.Provider value={{ user, login, logout, loading, refreshUser: checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };