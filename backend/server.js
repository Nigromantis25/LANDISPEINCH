const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
// Permitir CORS durante desarrollo (acepta cualquier origen)
app.use(cors());
app.use(express.json());

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal!' });
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'Servidor de Open World funcionando correctamente' });
});

// Conexión a la base de datos
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'openworld',
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
  console.log('Conectado a la base de datos MySQL - Open World');
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

          res.status(201).json({ message: 'Usuario registrado exitosamente en Open World' });
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
        process.env.JWT_SECRET || 'tu_secret_key_openworld',
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
    const { nombre, email, telefono, destino, fechaSalida, fechaRetorno, personas, preferencias, offerId, offerPrice, offerDiscount } = req.body;

    const query = `
      INSERT INTO reservas (nombre, email, telefono, destino, fecha_salida, fecha_retorno, personas, preferencias, offer_id, offer_price, offer_discount, fecha_reserva)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre, email, telefono, destino, fechaSalida, fechaRetorno, personas, preferencias, offerId || null, offerPrice || null, offerDiscount || null], (err, results) => {
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

// Listar todas las reservas
app.get('/api/reservas', (req, res) => {
  db.query('SELECT * FROM reservas ORDER BY fecha_reserva DESC', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener reservas' });
    }
    res.json(results);
  });
});

// Obtener una reserva por id
app.get('/api/reservas/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM reservas WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener la reserva' });
    }
    if (results.length === 0) return res.status(404).json({ message: 'Reserva no encontrada' });
    res.json(results[0]);
  });
});

// Actualizar reserva
app.put('/api/reservas/:id', (req, res) => {
  const id = req.params.id;
  const { nombre, email, telefono, destino, fechaSalida, fechaRetorno, personas, preferencias, offerId, offerPrice, offerDiscount } = req.body;
  const query = `
    UPDATE reservas SET nombre = ?, email = ?, telefono = ?, destino = ?, fecha_salida = ?, fecha_retorno = ?, personas = ?, preferencias = ?, offer_id = ?, offer_price = ?, offer_discount = ? WHERE id = ?
  `;
  db.query(query, [nombre, email, telefono, destino, fechaSalida, fechaRetorno, personas, preferencias || '', offerId || null, offerPrice || null, offerDiscount || null, id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al actualizar la reserva' });
    }
    res.json({ message: 'Reserva actualizada correctamente' });
  });
});

// Eliminar reserva
app.delete('/api/reservas/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM reservas WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al eliminar la reserva' });
    }
    res.json({ message: 'Reserva eliminada correctamente' });
  });
});

// Crear factura (simple: guardar registro y devolver datos para impresión)
app.post('/api/facturas', (req, res) => {
  const { reservaId, nombre, email, telefono, destino, fechaSalida, fechaRetorno, personas, preferencias, metodoPago } = req.body;
  const query = `
    INSERT INTO facturas (reserva_id, nombre, email, telefono, destino, fecha_salida, fecha_retorno, personas, preferencias, metodo_pago, fecha_factura)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;
  db.query(query, [reservaId || null, nombre, email, telefono, destino, fechaSalida, fechaRetorno, personas, preferencias || '', metodoPago || 'No especificado'], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al generar la factura' });
    }
    const facturaId = results.insertId;
    res.status(201).json({ message: 'Factura generada', facturaId, factura: { facturaId, reservaId, nombre, email, telefono, destino, fechaSalida, fechaRetorno, personas, preferencias, metodoPago } });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor Open World corriendo en el puerto ${PORT}`);
});