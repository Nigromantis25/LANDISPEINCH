// Supabase Server Configuration para Node.js/Express
// Instalar: npm install @supabase/supabase-js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuración de Supabase
const SUPABASE_URL = process.env.SUPABASE_URL || 'TU_SUPABASE_URL';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'TU_SUPABASE_SERVICE_KEY';

// Cliente de Supabase para el backend (con service_role key para operaciones admin)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// ===== FUNCIONES DE USUARIOS =====

async function getUserByEmail(email) {
    const { data, error } = await supabase
        .from('usuario')
        .select('*')
        .eq('email', email)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
}

async function createUser(userData) {
    const { data, error } = await supabase
        .from('usuario')
        .insert([userData])
        .select()
        .single();

    if (error) throw error;
    return data;
}

async function getUserById(id) {
    const { data, error } = await supabase
        .from('usuario')
        .select('id, nombre, email, rol, fecha_registro')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

// ===== FUNCIONES DE DESTINOS =====

async function getDestinos() {
    const { data, error } = await supabase
        .from('destinos')
        .select(`
            *,
            actividades (nombre),
            gastronomia (nombre),
            horarios (dias, horas),
            imagenes (url)
        `);

    if (error) throw error;
    return data;
}

async function getDestinoById(id) {
    const { data, error } = await supabase
        .from('destinos')
        .select(`
            *,
            actividades (nombre),
            gastronomia (nombre),
            horarios (dias, horas),
            imagenes (url)
        `)
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

// ===== FUNCIONES DE RESERVAS =====

async function createReserva(reservaData) {
    const { data, error } = await supabase
        .from('reservas')
        .insert([{
            nombre: reservaData.nombre,
            email: reservaData.email,
            telefono: reservaData.telefono,
            destino: reservaData.destino,
            fecha_salida: reservaData.fechaSalida,
            fecha_retorno: reservaData.fechaRetorno,
            personas: reservaData.personas,
            preferencias: reservaData.preferencias,
            offer_id: reservaData.offerId || null,
            offer_price: reservaData.offerPrice || null,
            offer_discount: reservaData.offerDiscount || null
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
}

async function getReservas() {
    const { data, error } = await supabase
        .from('reservas')
        .select('*')
        .order('fecha_reserva', { ascending: false });

    if (error) throw error;
    return data;
}

async function getReservaById(id) {
    const { data, error } = await supabase
        .from('reservas')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

async function updateReserva(id, reservaData) {
    const { data, error } = await supabase
        .from('reservas')
        .update({
            nombre: reservaData.nombre,
            email: reservaData.email,
            telefono: reservaData.telefono,
            destino: reservaData.destino,
            fecha_salida: reservaData.fechaSalida,
            fecha_retorno: reservaData.fechaRetorno,
            personas: reservaData.personas,
            preferencias: reservaData.preferencias,
            offer_id: reservaData.offerId || null,
            offer_price: reservaData.offerPrice || null,
            offer_discount: reservaData.offerDiscount || null
        })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

async function deleteReserva(id) {
    const { error } = await supabase
        .from('reservas')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// ===== FUNCIONES DE FACTURAS =====

async function createFactura(facturaData) {
    const { data, error } = await supabase
        .from('facturas')
        .insert([facturaData])
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Exportar funciones
module.exports = {
    supabase,
    users: {
        getByEmail: getUserByEmail,
        create: createUser,
        getById: getUserById
    },
    destinos: {
        getAll: getDestinos,
        getById: getDestinoById
    },
    reservas: {
        create: createReserva,
        getAll: getReservas,
        getById: getReservaById,
        update: updateReserva,
        delete: deleteReserva
    },
    facturas: {
        create: createFactura
    }
};
