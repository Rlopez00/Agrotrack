// src/pages/FAQ.jsx
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqData = [
  {
    question: "¿Cómo puedo agregar un producto al carrito?",
    answer:
      "En la página de la tienda, haz clic en el botón 'Agregar al Carrito' debajo del producto que deseas comprar.",
  },
  {
    question: "¿Cuáles son las opciones de pago disponibles?",
    answer:
      "Aceptamos tarjetas de crédito, débito y transferencias bancarias. También puedes contactar con nosotros para opciones de pago personalizadas.",
  },
  {
    question: "¿Cuál es el tiempo de envío estimado?",
    answer:
      "El tiempo de envío varía según tu ubicación. Generalmente, los pedidos se entregan entre 3 y 7 días hábiles.",
  },
  {
    question: "¿Puedo cancelar mi pedido después de haberlo realizado?",
    answer:
      "Sí, puedes cancelar tu pedido dentro de las primeras 24 horas después de realizarlo contactándonos directamente.",
  },
  {
    question: "¿Ofrecen garantía en sus productos?",
    answer:
      "Todos nuestros productos cuentan con una garantía de 1 año contra defectos de fabricación.",
  },
  // Agrega más preguntas y respuestas según sea necesario
];

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
        Preguntas Frecuentes
      </h1>
      <div className="max-w-2xl mx-auto">
        {faqData.map((item, index) => (
          <div key={index} className="border-b border-gray-200 py-4">
            <button
              className="w-full flex justify-between items-center text-left focus:outline-none"
              onClick={() => toggleFAQ(index)}
            >
              <span className="text-lg font-medium">{item.question}</span>
              {activeIndex === index ? (
                <FaChevronUp className="text-gray-600" />
              ) : (
                <FaChevronDown className="text-gray-600" />
              )}
            </button>
            {activeIndex === index && (
              <div className="mt-2 text-gray-600">{item.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
