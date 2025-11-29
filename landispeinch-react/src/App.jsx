import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import ProductGrid from './components/ProductGrid/ProductGrid';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import './App.css';

function App() {
  const handleAddToCart = (product) => {
    // TODO: Implementar lógica del carrito
    console.log('Añadido al carrito:', product);
  };

  const handleCartClick = () => {
    // TODO: Implementar apertura del modal del carrito
    console.log('Abrir carrito');
  };

  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  return (
    <Router>
      <div className="App">
        <Navbar onCartClick={handleCartClick} />
        <Routes>
          <Route path="/login" element={!isAuthenticated() ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated() ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={
            <main>
              <section className="hero-section">
                <h2>Descubre tu estilo</h2>
                <p>Elegancia y comodidad en cada prenda</p>
              </section>
              <ProductGrid onAddToCart={handleAddToCart} />
            </main>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;