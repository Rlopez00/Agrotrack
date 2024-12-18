// src/pages/Home.jsx

import React from "react";
import { Link } from "react-router-dom";
import {
  FaRegClipboard,
  FaMapMarkedAlt,
  FaChartLine,
  FaStethoscope,
  FaRobot,
  FaStore,
  FaShoppingCart,
} from "react-icons/fa";

const disciplines = [
  {
    name: "Registro de Ganado",
    icon: <FaRegClipboard size={50} className="text-green-600 mx-auto" />,
    link: "/registrodevacas",
  },
  {
    name: "Ubicación de Ganado",
    icon: <FaMapMarkedAlt size={50} className="text-green-600 mx-auto" />,
    link: "/mapa",
  },
  {
    name: "Monitoreo de Ganado",
    icon: <FaChartLine size={50} className="text-green-600 mx-auto" />,
    link: "/monitoreo",
  },
  {
    name: "Enfermedades de Ganado",
    icon: <FaStethoscope size={50} className="text-green-600 mx-auto" />,
    link: "/enfermedades",
  },
  {
    name: "Asistente de IA",
    icon: <FaRobot size={50} className="text-green-600 mx-auto" />,
    link: "/contact",
  },
  {
    name: "Tienda",
    icon: <FaStore size={50} className="text-green-600 mx-auto" />,
    link: "/shop",
  },
  {
    name: "Carrito",
    icon: <FaShoppingCart size={50} className="text-green-600 mx-auto" />,
    link: "/cart",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-700 py-12 px-4">
      <div className="container mx-auto">
        {/* Saludo estático */}
        <h1 className="text-4xl font-extrabold mb-12 text-center text-white">
          ¡Bienvenido a Agrotrack!
        </h1>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {disciplines.map((discipline) => (
            <Link
              key={discipline.name}
              to={discipline.link}
              className="group relative block bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transform transition duration-500 hover:scale-105"
            >
              <div className="flex justify-center items-center h-56 bg-gray-100 group-hover:bg-gray-200 transition duration-500">
                {discipline.icon}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition duration-300 text-center">
                  {discipline.name}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
