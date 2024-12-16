// src/pages/ProductDetails.jsx
import React, { useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import {
  FaArrowLeft,
  FaShoppingCart,
  FaTools,
  FaCogs,
  FaShippingFast,
  FaBolt,
  FaLeaf,
} from "react-icons/fa";

// Lista de productos (puedes importarla si está en otro archivo)
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

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  // Buscar el producto por ID
  const product = products.find((item) => item.id === id);

  if (!product) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
        <Link
          to="/shop"
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          Volver a la Tienda
        </Link>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-4">
      <Link
        to="/shop"
        className="flex items-center text-green-700 hover:text-green-900 mb-6"
      >
        <FaArrowLeft className="mr-2" /> Volver a la Tienda
      </Link>
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md p-6">
        <div className="md:w-1/2 flex flex-col items-center">
          <div className="mb-4">{product.icon}</div>
          <img
            src={product.image}
            alt={product.name}
            className="h-64 w-auto mb-4 object-contain"
          />
        </div>
        <div className="md:w-1/2 md:pl-6">
          <h2 className="text-3xl font-bold mb-4 text-green-700">
            {product.name}
          </h2>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-green-600 font-bold text-2xl mb-4">
            {formatCurrency(product.price)}
          </p>
          <p className="text-gray-600 mb-6">
            <strong>Especificaciones:</strong> {product.specifications}
          </p>
          {product.price > 0 ? (
            <button
              onClick={() => addToCart(product)}
              className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition flex items-center"
            >
              <FaShoppingCart className="mr-2" /> Agregar al Carrito
            </button>
          ) : (
            <Link
              to="/buy"
              className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition flex items-center"
            >
              Contactar por Servicio
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
