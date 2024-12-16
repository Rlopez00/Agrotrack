// src/pages/Cart.jsx
import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } =
    useContext(CartContext);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
          Carrito de Compras
        </h1>
        <p className="text-center">El carrito está vacío.</p>
        <div className="text-center mt-4">
          <Link
            to="/shop"
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
          >
            Volver a la Tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
        Carrito de Compras
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">Producto</th>
              <th className="py-3 px-4 text-left">Precio</th>
              <th className="py-3 px-4 text-left">Cantidad</th>
              <th className="py-3 px-4 text-left">Total</th>
              <th className="py-3 px-4 text-left">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{item.name}</td>
                <td className="py-3 px-4">{formatCurrency(item.price)}</td>
                <td className="py-3 px-4">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, parseInt(e.target.value))
                    }
                    className="w-16 border border-gray-300 rounded p-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </td>
                <td className="py-3 px-4">
                  {formatCurrency(item.quantity * item.price)}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800 font-semibold flex items-center"
                  >
                    <FaTrash className="mr-1" /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center mt-4">
        <p className="text-xl font-semibold mb-4 md:mb-0">
          Total: {formatCurrency(totalPrice)}
        </p>
        <div className="flex space-x-4">
          <button
            onClick={clearCart}
            className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition flex items-center"
          >
            Vaciar Carrito
          </button>
          <Link
            to="/buy"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition flex items-center"
          >
            Proceder a Comprar
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
