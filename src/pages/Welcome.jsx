// src/pages/Welcome.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const tabs = [
  {
    title: "¿Qué es Agrotrack?",
    content:
      "Agrotrack es una aplicación diseñada para gestionar y monitorear tu ganado de manera eficiente y sencilla.",
  },
  {
    title: "Funciones Principales",
    content:
      "Registra tus vacas, monitorea su ubicación en tiempo real y utiliza inteligencia artificial para optimizar el manejo de tu ganado.",
  },
  {
    title: "Cómo Empezar",
    content:
      "Regístrate o inicia sesión para comenzar a gestionar tu grupo de vacas y aprovechar todas las funcionalidades que Agrotrack ofrece.",
  },
];

function Welcome() {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  const handleComencemos = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full mx-auto">
        <div className="text-center">
          <img
            src="/logo.png"
            alt="Agrotrack Logo"
            className="h-24 w-auto mx-auto mb-6"
          />
          <h1 className="text-4xl font-extrabold mb-6 text-gray-800">
            Bienvenido a <span className="text-green-600">Agrotrack</span>
          </h1>
        </div>
        <div className="flex flex-wrap justify-center mb-6">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`m-2 px-4 py-2 rounded-full font-semibold transition duration-300 ${
                activeTab === index
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab(index)}
            >
              {tab.title}
            </button>
          ))}
        </div>
        <div className="mb-8 text-center">
          <p className="text-gray-700 text-lg">{tabs[activeTab].content}</p>
        </div>
        <button
          onClick={handleComencemos}
          className="w-full bg-green-600 text-white py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-green-700 transition duration-300"
        >
          ¡Comencemos!
        </button>
      </div>
    </div>
  );
}

export default Welcome;
