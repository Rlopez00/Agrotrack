// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Nav from "./components/Nav";

// Importar páginas existentes
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Enfermedades from "./pages/Enfermedades";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Welcome from "./pages/Welcome";
import Mapa from "./pages/Mapa";
import Monitoreo from "./pages/Monitoreo";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Buy from "./pages/Buy";
import ProductDetails from "./pages/ProductDetails";
import FAQ from "./pages/FAQ"; // Importar la nueva página

// Importar el CartProvider
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/registrodevacas" element={<About />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/monitoreo" element={<Monitoreo />} />
          <Route path="/enfermedades" element={<Enfermedades />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/faq" element={<FAQ />} /> {/* Nueva ruta */}
          <Route path="*" element={<Navigate to="/welcome" />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
