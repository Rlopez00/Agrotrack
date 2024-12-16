// src/components/Nav.jsx

import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

function Nav() {
  const { totalItems } = useContext(CartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Función para cerrar el menú al hacer clic en un enlace
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-green-700 text-white p-4 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/welcome" className="text-2xl font-bold">
          Agrotrack
        </Link>

        {/* Botón del Menú Hamburguesa - Visible en pantallas pequeñas */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Enlaces de Navegación - Ocultos en pantallas pequeñas */}
        <div className="hidden md:flex space-x-4">
          <Link
            to="/home"
            className="hover:text-gray-200 transition duration-200"
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="hover:text-gray-200 transition duration-200"
          >
            Tienda
          </Link>
          <Link
            to="/faq"
            className="hover:text-gray-200 transition duration-200"
          >
            FAQ
          </Link>
          <Link
            to="/about"
            className="hover:text-gray-200 transition duration-200"
          >
            Acerca de
          </Link>
          <Link
            to="/contact"
            className="hover:text-gray-200 transition duration-200"
          >
            Contacto
          </Link>
          <Link to="/cart" className="relative hover:text-gray-200">
            <FaShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-xs rounded-full px-1">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {/* Aplicamos clases para posicionarlo fijo, con fondo semitransparente y transición */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full h-full bg-green-700 bg-opacity-95 text-white transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-40`}
      >
        <ul className="flex flex-col items-center justify-center space-y-6 h-full">
          <li>
            <Link
              to="/home"
              onClick={handleLinkClick}
              className="text-2xl hover:text-gray-200 transition duration-200"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/shop"
              onClick={handleLinkClick}
              className="text-2xl hover:text-gray-200 transition duration-200"
            >
              Tienda
            </Link>
          </li>
          <li>
            <Link
              to="/faq"
              onClick={handleLinkClick}
              className="text-2xl hover:text-gray-200 transition duration-200"
            >
              FAQ
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              onClick={handleLinkClick}
              className="text-2xl hover:text-gray-200 transition duration-200"
            >
              Acerca de
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              onClick={handleLinkClick}
              className="text-2xl hover:text-gray-200 transition duration-200"
            >
              Contacto
            </Link>
          </li>
          <li>
            <Link
              to="/cart"
              onClick={handleLinkClick}
              className="relative text-2xl hover:text-gray-200 flex items-center"
            >
              <FaShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="ml-2 bg-red-600 text-xs rounded-full px-1">
                  {totalItems}
                </span>
              )}
              <span className="ml-2">Carrito</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
