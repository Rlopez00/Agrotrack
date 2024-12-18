// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { supabase } from "../client";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [ganadero, setGanadero] = useState(null);
  const [loading, setLoading] = useState(true);

  // Obtener la sesión inicial al montar el componente
  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        setLoading(false);
        return;
      }

      if (session?.user) {
        setGanadero(session.user);
      } else {
        setGanadero(null);
      }
      setLoading(false);
    };

    fetchSession();
  }, []);

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setGanadero(session.user);
        } else {
          setGanadero(null);
        }
      }
    );

    // Limpiar la suscripción al desmontar el componente
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Función de login usando Supabase Auth
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data; // Retorna los datos para su uso posterior
  };

  // Función de signup usando Supabase Auth
  const signup = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data; // Retorna los datos para su uso posterior
  };

  // Función de logout usando Supabase Auth
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error signing out:", error);
    setGanadero(null);
  };

  return (
    <AuthContext.Provider value={{ ganadero, login, logout, signup, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
