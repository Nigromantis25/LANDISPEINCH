const express = require('express');
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

// Cliente Supabase para operaciones servidor
const supabaseBackend = require('./supabase');

console.log('Usando Supabase como fuente principal de datos');

// Rutas de autenticación
app.post('/api/auth/register', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const validRoles = ['admin', 'vendedor', 'cliente'];
    const userRole = validRoles.includes(rol) ? rol : 'cliente';

    // Verificar si existe en Supabase
    const existing = await supabaseBackend.users.getByEmail(email);
    if (existing) return res.status(400).json({ message: 'El email ya está registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = { nombre, email, password: hashedPassword, rol: userRole };
    const created = await supabaseBackend.users.create(userData);
    res.status(201).json({ message: 'Usuario registrado exitosamente en Open World', rol: userRole, user: { id: created.id, email: created.email, nombre: created.nombre } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await supabaseBackend.users.getByEmail(email);
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'tu_secret_key_openworld', { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, email: user.email, nombre: user.nombre } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Rutas para reservas de viajes (nuevo)
app.post('/api/reservas', async (req, res) => {
  try {
    const { nombre, email, telefono, destino, fechaSalida, fechaRetorno, personas, preferencias, offerId, offerPrice, offerDiscount } = req.body;
    const supaPayload = { nombre, email, telefono, destino, fechaSalida, fechaRetorno, personas, preferencias, offerId, offerPrice, offerDiscount };
    const created = await supabaseBackend.reservas.create(supaPayload);
    res.status(201).json({ message: '¡Reserva confirmada! Nos contactaremos pronto', reserva: created });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al procesar la reserva', error: String(error) });
  }
});

app.get('/api/destinos', async (req, res) => {
  try {
    const data = await supabaseBackend.destinos.getAll();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener destinos' });
  }
});

// Listar todas las reservas
app.get('/api/reservas', async (req, res) => {
  try {
    const data = await supabaseBackend.reservas.getAll();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener reservas' });
  }
});

// Obtener una reserva por id
app.get('/api/reservas/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = await supabaseBackend.reservas.getById(id);
    if (!data) return res.status(404).json({ message: 'Reserva no encontrada' });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la reserva' });
  }
});

// Actualizar reserva
app.put('/api/reservas/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await supabaseBackend.reservas.update(id, req.body);
    res.json({ message: 'Reserva actualizada correctamente', reserva: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la reserva' });
  }
});

// Eliminar reserva
app.delete('/api/reservas/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await supabaseBackend.reservas.delete(id);
    res.json({ message: 'Reserva eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la reserva' });
  }
});

// Crear factura (simple: guardar registro y devolver datos para impresión)
app.post('/api/facturas', async (req, res) => {
  try {
    const facturaData = req.body;
    const created = await supabaseBackend.facturas.create(facturaData);
    res.status(201).json({ message: 'Factura generada', factura: created });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al generar la factura' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor Open World corriendo en el puerto ${PORT}`);
});