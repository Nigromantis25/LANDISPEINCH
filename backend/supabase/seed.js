const fs = require('fs');
const path = require('path');
const { upsertDestinos, upsertReservas } = require('./index');

async function loadJSON(filePath) {
  const candidates = [
    path.resolve(__dirname, '..', filePath),
    path.resolve(__dirname, '..', '..', filePath),
    path.resolve(process.cwd(), filePath)
  ];
  for (const p of candidates) {
    try {
      if (!fs.existsSync(p)) continue;
      const raw = fs.readFileSync(p, 'utf8');
      return JSON.parse(raw);
    } catch (err) {
      console.warn('Intentando leer', p, '->', err.message || err);
      continue;
    }
  }
  console.warn('No se pudo leer ninguno de los candidatos para', filePath);
  return null;
}

(async () => {
  try {
    // Seed destinos desde turismo.json
    const destinos = await loadJSON('turismo.json');
    if (Array.isArray(destinos) && destinos.length) {
      // Mapear sólo las columnas existentes en la tabla 'destinos'
      const payload = destinos.map(it => ({
        id: it.id,
        nombre: it.Lugar || it.name || null,
        ubicacion: it.ubicacion || null,
        descripcion: it.descripcion || it.description || null,
        precio_entrada: it.precioEntrada || it.precio_entrada || null
      }));
      console.log('Subiendo', payload.length, 'destinos a Supabase (campos básicos)...');
      const res = await upsertDestinos(payload);
      console.log('Destinos upsert completado. Registros:', (res && res.length) || 0);
    } else {
      console.log('No hay destinos para subir. Archivo turismo.json vacío o no encontrado.');
    }

    // Seed reservas desde archivo local de fallback si existe
    const reservasCandidates = [
      path.resolve(__dirname, '..', 'database', 'reservas.json'),
      path.resolve(__dirname, '..', '..', 'database', 'reservas.json'),
      path.resolve(process.cwd(), 'database', 'reservas.json')
    ];
    let reservasRaw = null;
    for (const rf of reservasCandidates) {
      if (fs.existsSync(rf)) {
        try {
          reservasRaw = JSON.parse(fs.readFileSync(rf, 'utf8'));
          break;
        } catch (err) {
          console.warn('Error leyendo reservas en', rf, err.message || err);
        }
      }
    }
    if (reservasRaw) {
      if (Array.isArray(reservasRaw) && reservasRaw.length) {
        const payloadR = reservasRaw.map(r => ({
          id: r.id && typeof r.id === 'number' ? r.id : undefined,
          nombre: r.nombre || '',
          email: r.email || '',
          telefono: r.telefono || '',
          destino: r.destino || '',
          fecha_salida: r.fecha_salida || null,
          fecha_retorno: r.fecha_retorno || null,
          personas: r.personas || 1,
          preferencias: r.preferencias || r.preferencias || '',
          offer_id: r.offer_id || null,
          offer_price: r.offer_price || null,
          offer_discount: r.offer_discount || null,
          fecha_reserva: r.fecha_reserva || new Date().toISOString()
        }));
        console.log('Subiendo', payloadR.length, 'reservas a Supabase...');
        const rr = await upsertReservas(payloadR);
        console.log('Reservas upsert completado. Registros:', (rr && rr.length) || 0);
      } else {
        console.log('No hay reservas locales para subir.');
      }
    } else {
      console.log('Archivo de reservas locales no encontrado en rutas previstas. Busque en la raíz o en backend/database.');
    }

    console.log('Seed terminado.');
  } catch (err) {
    console.error('Error en seed:', err.message || err);
    process.exit(2);
  }
})();
