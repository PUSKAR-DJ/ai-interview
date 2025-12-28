import { createContext, useState, useEffect } from "react";
import { getProfile, loginUser, logoutUser } from "../api/auth.api";

// 1. Create Context with 'null' as default
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
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const user = await loginUser(credentials);
    // Directly set user from response or re-fetch
    // If your loginUser returns the user object, use it directly to save a network call
    // Otherwise, fetch profile:
    const profile = await getProfile();
    setUser(profile.user);
    return profile.user;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  // 2. Value MUST be an object, even if user is null
  const value = { user, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Export Context for the hook to use
export { AuthContext };