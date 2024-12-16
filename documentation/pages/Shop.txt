// src/pages/Shop.jsx
import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import {
  FaShippingFast,
  FaTools,
  FaCogs,
  FaBolt,
  FaLeaf,
} from "react-icons/fa";

function Shop() {
  const { addToCart } = useContext(CartContext);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const products = [
    {
      id: "kit1",
      name: "Agrotrack Kit",
      description: "Kit básico de monitoreo para tu ganado.",
      price: 1999.99,
      image: "/kit.png",
      icon: <FaTools size={40} color="#4CAF50" />,
      specifications:
        "Incluye sensores básicos, monitoreo en tiempo real y soporte técnico estándar.",
    },
    {
      id: "service1",
      name: "Servicio de Consultoría",
      description: "Contáctanos para servicios personalizados.",
      price: 0,
      image: "/service.png",
      icon: <FaCogs size={40} color="#2196F3" />,
      specifications:
        "Consultoría personalizada para optimizar tus operaciones ganaderas.",
    },
    {
      id: "kit2",
      name: "Agrotrack Avanzado",
      description: "Kit avanzado con funcionalidades adicionales.",
      price: 2999.99,
      image: "/kit-advanced.png",
      icon: <FaTools size={40} color="#4CAF50" />,
      specifications:
        "Sensores avanzados, integración con software de análisis y soporte premium.",
    },
    {
      id: "service2",
      name: "Soporte Técnico Premium",
      description: "Soporte técnico prioritario 24/7.",
      price: 4999.99,
      image: "/support.png",
      icon: <FaShippingFast size={40} color="#FF5722" />,
      specifications:
        "Soporte técnico prioritario, actualizaciones regulares y consultoría continua.",
    },
    {
      id: "kit3",
      name: "Agrotrack Profesional",
      description: "Kit profesional para grandes operaciones ganaderas.",
      price: 4999.99,
      image: "/kit-professional.png",
      icon: <FaBolt size={40} color="#FFC107" />,
      specifications:
        "Sensores de alta precisión, múltiples integraciones y soporte dedicado.",
    },
    {
      id: "service3",
      name: "Mantenimiento Regular",
      description: "Servicio de mantenimiento mensual.",
      price: 1499.99,
      image: "/maintenance.png",
      icon: <FaLeaf size={40} color="#8BC34A" />,
      specifications:
        "Mantenimiento preventivo, revisión de sensores y optimización del sistema.",
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
        Tienda
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center"
          >
            <div className="mb-4">{product.icon}</div>
            <Link to={`/product/${product.id}`}>
              <img
                src={product.image}
                alt={product.name}
                className="h-40 w-auto mb-4 object-contain"
              />
            </Link>
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>
            {product.price > 0 ? (
              <div className="w-full">
                <p className="text-green-600 font-bold text-lg mb-2">
                  {formatCurrency(product.price)}
                </p>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors duration-300"
                >
                  Agregar al Carrito
                </button>
              </div>
            ) : (
              <div className="w-full">
                <Link
                  to="/buy"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300 inline-block text-center"
                >
                  Contactar por Servicio
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shop;
