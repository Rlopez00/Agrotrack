// src/pages/Home.jsx

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const disciplines = [
  {
    name: "Registro de Ganado",
    image: "/vaca.png",
    link: "/registrodevacas",
  },
  {
    name: "Ubicación de Ganado",
    image: "/vacagps.png",
    link: "/mapa",
  },
  {
    name: "Monitoreo de Ganado",
    image: "/vacadn.png",
    link: "/monitoreo",
  },
  {
    name: "Enfermedades de Ganado",
    image: "/vacaenferma.png",
    link: "/enfermedades",
  },
  {
    name: "Asistente de IA",
    image: "/iavaca.png",
    link: "/contact",
  },
];

const Home = () => {
  const { ganadero } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-700 py-12 px-4">
      <div className="container mx-auto">
        {ganadero && (
          <h1 className="text-4xl font-extrabold mb-12 text-center text-white">
            ¡Hola, <span className="text-yellow-300">{ganadero.nombre}</span>!
          </h1>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {disciplines.map((discipline) => (
            <Link
              key={discipline.name}
              to={discipline.link}
              className="group relative block bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transform transition duration-500 hover:scale-105"
            >
              <img
                src={discipline.image}
                alt={discipline.name}
                className="w-full h-56 object-cover group-hover:opacity-75 transition duration-500"
              />
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
