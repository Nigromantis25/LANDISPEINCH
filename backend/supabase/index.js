require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('Supabase: SUPABASE_URL o SUPABASE_SERVICE_KEY no configuradas en backend/.env');
}

const supabase = createClient(SUPABASE_URL || '', SUPABASE_KEY || '');

async function testConnection() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return { ok: false, error: 'SUPABASE_URL or SUPABASE_SERVICE_KEY not set in backend/.env' };
  }
  try {
    // intentar una consulta simple a la tabla reservas
    const { data, error } = await supabase.from('reservas').select('id').limit(1);
    if (error) return { ok: false, error };
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err };
  }
}

async function upsertDestinos(items) {
  // items: array of objects matching columns in table 'destinos'
  const { data, error } = await supabase.from('destinos').upsert(items, { onConflict: 'id' });
  if (error) throw error;
  return data;
}

async function upsertReservas(items) {
  // items: array of objects matching columns in table 'reservas'
  // Use insert for reservas but allow upsert if id provided
  const { data, error } = await supabase.from('reservas').upsert(items, { onConflict: 'id' });
  if (error) throw error;
  return data;
}

module.exports = {
  supabase,
  testConnection,
  upsertDestinos,
  upsertReservas
};
