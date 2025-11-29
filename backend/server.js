const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal!' });
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'Servidor de Moverse funcionando correctamente' });
});

// Conexión a la base de datos
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'moverse',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Probar conexión al pool
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL - Moverse');
  connection.release();
});

// Rutas de autenticación
app.post('/api/auth/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Verificar si el usuario ya existe
    db.query('SELECT * FROM usuario WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error en el servidor' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'El email ya está registrado' });
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insertar nuevo usuario
      db.query(
        'INSERT INTO usuario (nombre, email, password) VALUES (?, ?, ?)',
        [nombre, email, hashedPassword],
        (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error al registrar usuario' });
          }

          res.status(201).json({ message: 'Usuario registrado exitosamente en Moverse' });
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    db.query('SELECT * FROM usuario WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error en el servidor' });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const user = results[0];

      // Verificar contraseña
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      // Generar token JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'tu_secret_key_moverse',
        { expiresIn: '24h' }
      );

      res.json({ token, user: { id: user.id, email: user.email, nombre: user.nombre } });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Rutas para reservas de viajes (nuevo)
app.post('/api/reservas', (req, res) => {
  try {
    const { nombre, email, telefono, destino, fechaSalida, fechaRetorno, personas, preferencias } = req.body;

    const query = `
      INSERT INTO reservas (nombre, email, telefono, destino, fecha_salida, fecha_retorno, personas, preferencias, fecha_reserva)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre, email, telefono, destino, fechaSalida, fechaRetorno, personas, preferencias], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al procesar la reserva' });
      }
      res.status(201).json({ message: '¡Reserva confirmada! Nos contactaremos pronto', reservaId: results.insertId });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.get('/api/destinos', (req, res) => {
  db.query('SELECT * FROM destinos', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener destinos' });
    }
    res.json(results);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor Moverse corriendo en el puerto ${PORT}`);
});