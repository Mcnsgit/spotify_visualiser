// src/AuthContext.js
import React, { createContext, useState, useContext, useMemo } from 'react';
// Create the AuthContext
export const AuthContext = createContext();
// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [tokens, setTokens] = useState({ access_token: null, refresh_token: null });

  const value = useMemo(() => ({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    setAccess_token: (token) => setTokens((prev) => ({ ...prev, access_token: token })),
    setRefresh_token: (token) => setTokens((prev) => ({ ...prev, refresh_token: token })),
  }), [tokens]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};