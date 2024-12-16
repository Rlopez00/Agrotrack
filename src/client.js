// src/client.js
import { createClient } from "@supabase/supabase-js";

// Asegúrate de que estas variables de entorno estén definidas correctamente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Asegura que las sesiones se persistan
    detectSessionInUrl: true,
  },
});
