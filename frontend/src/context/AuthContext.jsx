import { useMemo, useState } from "react";
import { AuthContext, STORAGE_KEY } from "./auth-context";

const readStoredAuth = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { token: null, user: null };
    return JSON.parse(raw);
  } catch {
    return { token: null, user: null };
  }
};

export function AuthProvider({ children }) {
  const initialState = readStoredAuth();
  const [token, setToken] = useState(initialState.token);
  const [user, setUser] = useState(initialState.user);

  const login = (payload) => {
    setToken(payload.token);
    setUser(payload.user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
