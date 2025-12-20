const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();

const fs = require('fs').promises;
const path = require('path');
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

// Health check endpoint para DB (intenta leer 1 reserva desde Supabase)
app.get('/api/health-db', async (req, res) => {
  try {
    try {
      const data = await supabaseBackend.reservas.getAll();
      return res.json({ ok: true, source: 'supabase', count: Array.isArray(data) ? data.length : 0 });
    } catch (sErr) {
      console.warn('Health DB: Supabase falló, intentando fallback local', sErr && sErr.message ? sErr.message : sErr);
      const local = await getLocalReservas();
      return res.json({ ok: true, source: 'local-file', count: Array.isArray(local) ? local.length : 0 });
    }
  } catch (err) {
    console.error('Health DB error:', err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});

// Conectar con el cliente Supabase si está disponible
let supabaseBackend = null;
try {
  const connector = require('./supabase');
  const supabase = connector.supabase;

  supabaseBackend = {
    users: {
      async getByEmail(email) {
        const { data, error } = await supabase.from('usuario').select('*').eq('email', email).limit(1).maybeSingle();
        if (error) throw error;
        return data || null;
      },
      async create(userData) {
        const { data, error } = await supabase.from('usuario').insert([userData]).select().single();
        if (error) throw error;
        return data;
      }
    },
    reservas: {
      async create(payload) {
        const { data, error } = await supabase.from('reservas').insert([payload]).select().single();
        if (error) throw error;
        return data;
      },
      async getAll() {
        const { data, error } = await supabase.from('reservas').select('*');
        if (error) throw error;
        return data;
      },
      async getById(id) {
        const { data, error } = await supabase.from('reservas').select('*').eq('id', id).limit(1).maybeSingle();
        if (error) throw error;
        return data || null;
      },
      async update(id, fields) {
        const { data, error } = await supabase.from('reservas').update(fields).eq('id', id).select().single();
        if (error) throw error;
        return data;
      },
      async delete(id) {
        const { data, error } = await supabase.from('reservas').delete().eq('id', id).select().single();
        if (error) throw error;
        return data;
      }
    },
    destinos: {
      async getAll() {
        const { data, error } = await supabase.from('destinos').select('*');
        if (error) throw error;
        return data;
      }
    },
    facturas: {
      async create(payload) {
        const { data, error } = await supabase.from('facturas').insert([payload]).select().single();
        if (error) throw error;
        return data;
      }
    }
  };

  console.log('Supabase conectado: SI (cliente cargado).');
} catch (err) {
  console.warn('No se pudo cargar el conector de Supabase, usando fallbacks locales. Error:', err && err.message ? err.message : err);
  // Fallback: mantener el comportamiento anterior usando errores para forzar guardado local
  supabaseBackend = {
    users: {
      async getByEmail() { throw new Error('Supabase no configurado'); },
      async create() { throw new Error('Supabase no configurado'); }
    },
    reservas: {
      async create() { throw new Error('Supabase no configurado'); },
      async getAll() { throw new Error('Supabase no configurado'); },
      async getById() { throw new Error('Supabase no configurado'); },
      async update() { throw new Error('Supabase no configurado'); },
      async delete() { throw new Error('Supabase no configurado'); }
    },
    destinos: {
      async getAll() { throw new Error('Supabase no configurado'); }
    },
    facturas: {
      async create() { throw new Error('Supabase no configurado'); }
    }
  };
}

// Archivo local fallback para reservas (si Supabase no está configurado)
const reservasFile = path.join(__dirname, '..', 'database', 'reservas.json');

async function getLocalReservas() {
  try {
    await fs.mkdir(path.dirname(reservasFile), { recursive: true });
    const content = await fs.readFile(reservasFile, 'utf8').catch(() => '[]');
    const data = JSON.parse(content || '[]');
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('getLocalReservas error:', err);
    return [];
  }
}

async function saveLocalReserva(reserva) {
  try {
    const list = await getLocalReservas();
    const maxId = list.reduce((m, r) => (r.id && r.id > m ? r.id : m), 0);
    const nextId = maxId + 1;
    const record = {
      id: nextId,
      nombre: reserva.nombre || '',
      email: reserva.email || '',
      telefono: reserva.telefono || '',
      destino: reserva.destino || '',
      fecha_salida: reserva.fechaSalida || reserva.fecha_salida || null,
      fecha_retorno: reserva.fechaRetorno || reserva.fecha_retorno || null,
      personas: reserva.personas || reserva.personas === 0 ? reserva.personas : 1,
      preferencias: reserva.preferencias || reserva.preferencias || '',
      offer_id: reserva.offerId || reserva.offer_id || null,
      offer_price: reserva.offerPrice || reserva.offer_price || null,
      offer_discount: reserva.offerDiscount || reserva.offer_discount || null,
      fecha_reserva: new Date().toISOString()
    };
    list.push(record);
    await fs.mkdir(path.dirname(reservasFile), { recursive: true });
    await fs.writeFile(reservasFile, JSON.stringify(list, null, 2), 'utf8');
    return record;
  } catch (err) {
    console.error('saveLocalReserva error:', err);
    throw err;
  }
}

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
    // Mapear a nombres de columna usados en la BD
    const dbPayload = {
      nombre: nombre || '',
      email: email || '',
      telefono: telefono || null,
      destino: destino || '',
      fecha_salida: fechaSalida || null,
      fecha_retorno: fechaRetorno || null,
      personas: Number.isFinite(Number(personas)) ? Number(personas) : (personas ? Number(personas) : 1),
      preferencias: preferencias || '',
      offer_id: offerId || null,
      offer_price: offerPrice || null,
      offer_discount: offerDiscount || null,
      fecha_reserva: new Date().toISOString()
    };
    // Intentar guardar en Supabase
    try {
      const created = await supabaseBackend.reservas.create(dbPayload);
      return res.status(201).json({ message: '¡Reserva confirmada! Nos contactaremos pronto', reserva: created });
    } catch (sErr) {
      console.warn('Supabase reserva create falló, guardando localmente:', sErr && sErr.message ? sErr.message : sErr);
      // Guardar en archivo local como fallback
      try {
        const saved = await saveLocalReserva(dbPayload);
        return res.status(201).json({ message: 'Reserva guardada localmente (fallback)', reserva: saved });
      } catch (fErr) {
        console.error('Error guardando reserva localmente:', fErr);
        return res.status(500).json({ message: 'Error al procesar la reserva', error: String(fErr) });
      }
    }
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
    try {
      const data = await supabaseBackend.reservas.getAll();
      return res.json(data);
    } catch (sErr) {
      console.warn('Supabase getAll reservas falló, leyendo reservas locales:', sErr && sErr.message ? sErr.message : sErr);
      const local = await getLocalReservas();
      return res.json(local);
    }
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