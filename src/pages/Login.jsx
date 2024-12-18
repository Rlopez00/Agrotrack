// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Opcional si no usas autenticación
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Aquí, dado que la autenticación está deshabilitada,
    // simplemente redirigimos a /home
    // Puedes agregar lógica adicional si lo deseas
    navigate("/home");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-400 to-green-700">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="Agrotrack Logo"
            className="h-20 w-auto mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-800">Iniciar Sesión</h1>
        </div>
        {error && (
          <p className="text-red-600 mb-4 text-center font-semibold">{error}</p>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="Ingresa tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          {/* Opcional: Campo de Contraseña */}
          {/* <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
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
            {isLoading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          ¿No tienes una cuenta?{" "}
          <Link
            to="/signup"
            className="text-green-600 font-semibold hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
