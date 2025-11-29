import React, { useState } from 'react';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      if (response.ok) {
        // Guardar el token en localStorage
        localStorage.setItem('token', data.token);
        // Redirigir al usuario
        window.location.href = '/';
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al iniciar sesión');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="auth-button">
            Iniciar Sesión
          </button>
        </form>
        <p className="auth-link">
          ¿No tienes una cuenta? <a href="/register">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
};

export default Login;