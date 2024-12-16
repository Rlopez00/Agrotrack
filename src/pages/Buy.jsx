// src/pages/Buy.jsx
import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

function Buy() {
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleCheckout = (e) => {
    e.preventDefault();
    // Aquí puedes integrar con tu backend o Supabase
    clearCart();
    setSubmitted(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  if (submitted) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
          Gracias por tu compra
        </h1>
        <p className="text-center">Nos pondremos en contacto contigo pronto.</p>
        <Link
          to="/shop"
          className="mt-6 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          Volver a la Tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/2">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
          Finalizar Compra / Contactar
        </h1>
        {cartItems.length > 0 && (
          <div className="mb-6 border p-4 rounded bg-white shadow">
            <h2 className="text-xl font-semibold mb-2">Tu Pedido</h2>
            {cartItems.map((item) => (
              <p key={item.id} className="flex justify-between">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>{formatCurrency(item.quantity * item.price)}</span>
              </p>
            ))}
            <p className="mt-4 font-bold text-lg text-right">
              Total: {formatCurrency(totalPrice)}
            </p>
          </div>
        )}

        <form onSubmit={handleCheckout} className="bg-white rounded shadow p-6">
          <div className="mb-4">
            <label className="block font-semibold mb-1">Nombre</label>
            <input
              type="text"
              className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre completo"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Dirección</label>
            <input
              type="text"
              className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Tu dirección"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">
              Mensaje o Solicitud
            </label>
            <textarea
              className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Opcional: Dinos más acerca de tu solicitud"
              rows="4"
            ></textarea>
          </div>
          <button className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 transition">
            Enviar Pedido/Contacto
          </button>
        </form>
      </div>
      <div className="w-full md:w-1/2 flex flex-col items-center">
        {/* Puedes agregar una imagen o contenido adicional aquí */}
        <img
          src="/checkout.png" // Asegúrate de que esta imagen exista en la carpeta public
          alt="Checkout"
          className="w-full h-auto max-w-md"
        />
      </div>
    </div>
  );
}

export default Buy;
