// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../client"; // Asegúrate de tener esta importación

function Signup() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Opcional si no usas autenticación
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Insertar directamente en la tabla "ganaderos"
      const { error: insertError } = await supabase
        .from("ganaderos")
        .insert([{ nombre, telefono, direccion, email }]); // Añade 'email' si es necesario

      if (insertError) {
        throw insertError;
      }

      navigate("/home"); // Redirige a la página deseada después del registro
    } catch (err) {
      setError(err.message || "Error al registrar el ganadero");
      console.error("Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-400 to-green-700">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md mx-4">
        <div className="text-center mb-6">
          <img
            src="/logo.png"
            alt="Agrotrack Logo"
            className="h-20 w-auto mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-800">
            Registrar Ganadero
          </h1>
        </div>
        {error && (
          <p className="text-red-600 mb-4 text-center font-semibold">{error}</p>
        )}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              placeholder="Ingresa el nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Teléfono
            </label>
            <input
              type="text"
              placeholder="Ingresa el número de teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Dirección
            </label>
            <input
              type="text"
              placeholder="Ingresa la dirección"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          {/* Opcional: Campos de Email y Contraseña si decides usarlos */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="Ingresa el correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          {/* Campo de contraseña opcional */}
          {/* <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Crea una contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div> */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
          >
            {isLoading ? "Registrando..." : "Registrar Ganadero"}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            className="text-green-600 font-semibold hover:underline"
          >
            Inicia Sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
