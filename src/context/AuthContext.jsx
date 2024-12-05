// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from "react";
import { supabase } from "../client";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [ganadero, setGanadero] = useState(null);

  useEffect(() => {
    // Obtener el usuario almacenado en localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setGanadero(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setGanadero(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setGanadero(null);
  };

  return (
    <AuthContext.Provider value={{ ganadero, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
