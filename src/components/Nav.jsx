// src/components/Nav.jsx

import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "../context/AuthContext";

function Nav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { ganadero, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/welcome");
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-20">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/logo.png" className="h-10 w-auto" />
          <span className="ml-2 text-xl font-bold text-green-600">
            Agrotrack
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/welcome"
            className="text-gray-700 hover:text-green-600 font-medium transition duration-300"
          >
            ¿Qué es Agrotrack?
          </Link>
          {ganadero && (
            <>
              <Link
                to="/home"
                className="text-gray-700 hover:text-green-600 font-medium transition duration-300"
              >
                Home
              </Link>
              <Link
                to="/registrodevacas"
                className="text-gray-700 hover:text-green-600 font-medium transition duration-300"
              >
                Registro
              </Link>
              <Link
                to="/mapa"
                className="text-gray-700 hover:text-green-600 font-medium transition duration-300"
              >
                Mapa
              </Link>
              <Link
                to="/monitoreo"
                className="text-gray-700 hover:text-green-600 font-medium transition duration-300"
              >
                Monitoreo
              </Link>
              <Link
                to="/enfermedades"
                className="text-gray-700 hover:text-green-600 font-medium transition duration-300"
              >
                Enfermedades
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-green-600 font-medium transition duration-300"
              >
                IA
              </Link>
            </>
          )}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {ganadero ? (
            <>
              <span className="text-gray-700 font-medium">
                Hola, <span className="font-bold">{ganadero.nombre}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-full font-medium hover:bg-red-600 transition duration-300"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-green-600 text-white px-4 py-2 rounded-full font-medium hover:bg-green-700 transition duration-300"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/signup"
                className="border border-green-600 text-green-600 px-4 py-2 rounded-full font-medium hover:bg-green-600 hover:text-white transition duration-300"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <nav className="px-4 pt-4 pb-6 space-y-4">
            <Link
              to="/welcome"
              className="block text-gray-700 hover:text-green-600 font-medium transition duration-300"
              onClick={toggleMobileMenu}
            >
              ¿Qué es Agrotrack?
            </Link>
            {ganadero && (
              <>
                <Link
                  to="/home"
                  className="block text-gray-700 hover:text-green-600 font-medium transition duration-300"
                  onClick={toggleMobileMenu}
                >
                  Home
                </Link>
                <Link
                  to="/registrodevacas"
                  className="block text-gray-700 hover:text-green-600 font-medium transition duration-300"
                  onClick={toggleMobileMenu}
                >
                  Registro
                </Link>
                <Link
                  to="/mapa"
                  className="block text-gray-700 hover:text-green-600 font-medium transition duration-300"
                  onClick={toggleMobileMenu}
                >
                  Mapa
                </Link>
                <Link
                  to="/monitoreo"
                  className="block text-gray-700 hover:text-green-600 font-medium transition duration-300"
                  onClick={toggleMobileMenu}
                >
                  Monitoreo
                </Link>
                <Link
                  to="/enfermedades"
                  className="block text-gray-700 hover:text-green-600 font-medium transition duration-300"
                  onClick={toggleMobileMenu}
                >
                  Enfermedades
                </Link>
                <Link
                  to="/contact"
                  className="block text-gray-700 hover:text-green-600 font-medium transition duration-300"
                  onClick={toggleMobileMenu}
                >
                  IA
                </Link>
              </>
            )}
            {ganadero ? (
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-500 font-medium hover:text-red-600 transition duration-300"
              >
                Cerrar Sesión
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block bg-green-600 text-white px-4 py-2 rounded-full font-medium text-center hover:bg-green-700 transition duration-300"
                  onClick={toggleMobileMenu}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/signup"
                  className="block border border-green-600 text-green-600 px-4 py-2 rounded-full font-medium text-center hover:bg-green-600 hover:text-white transition duration-300"
                  onClick={toggleMobileMenu}
                >
                  Registrarse
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </nav>
  );
}

export default Nav;
