import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onCartClick }) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token') !== null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <h1>1807.studio</h1>
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/">Inicio</Link>
        <Link to="/productos">Productos</Link>
        <Link to="/novedades">Novedades</Link>
        <Link to="/contacto">Contacto</Link>
      </div>
      <div className="auth-buttons">
        {isAuthenticated ? (
          <button onClick={handleLogout} className="login-button">
            Cerrar sesión
          </button>
        ) : (
          <Link to="/login" className="login-button">
            Iniciar sesión
          </Link>
        )}
        <div className="cart-icon" onClick={onCartClick}>
          <i className="fas fa-shopping-cart"></i>
          <span className="cart-count">0</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;