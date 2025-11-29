import React, { useState } from 'react';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmarPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        alert('Registro exitoso');
        window.location.href = '/login';
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al registrar usuario');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Registro</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre completo"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
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
          <div className="form-group">
            <input
              type="password"
              name="confirmarPassword"
              placeholder="Confirmar contraseña"
              value={formData.confirmarPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="auth-button">
            Registrarse
          </button>
        </form>
        <p className="auth-link">
          ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
        </p>
      </div>
    </div>
  );
};

export default Register;