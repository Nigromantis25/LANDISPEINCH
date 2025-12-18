// Supabase Client Configuration
// Configura estas variables con tus credenciales de Supabase

const SUPABASE_URL = 'https://kqopuhqnmmktjhdunpij.supabase.co'; // Ejemplo: https://xxxxxx.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtxb3B1aHFubW1rdGpoZHVucGlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MzgxNTMsImV4cCI6MjA1MDExNDE1M30.L890m-m7nSj93m9988-X-n88m-X-n88m-X-n88m-X-n88'; // Tu clave anónima pública

// Cliente de Supabase para el frontend (JavaScript vanilla)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== FUNCIONES DE AUTENTICACIÓN =====

async function supabaseLogin(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error) throw error;
    return data;
}

async function supabaseRegister(email, password, userData) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                nombre: userData.nombre,
                rol: userData.rol || 'cliente'
            }
        }
    });
    if (error) throw error;
    return data;
}

async function supabaseLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// ===== FUNCIONES DE BASE DE DATOS =====

// Obtener todos los destinos
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

// Obtener un destino por ID
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

// Crear reserva
async function createReserva(reservaData) {
    const { data, error } = await supabase
        .from('reservas')
        .insert([reservaData])
        .select();
    if (error) throw error;
    return data;
}

// Obtener reservas del usuario
async function getUserReservas(email) {
    const { data, error } = await supabase
        .from('reservas')
        .select('*')
        .eq('email', email)
        .order('fecha_reserva', { ascending: false });
    if (error) throw error;
    return data;
}

// Obtener todas las reservas (admin/vendedor)
async function getAllReservas() {
    const { data, error } = await supabase
        .from('reservas')
        .select('*')
        .order('fecha_reserva', { ascending: false });
    if (error) throw error;
    return data;
}

// Actualizar reserva
async function updateReserva(id, updates) {
    const { data, error } = await supabase
        .from('reservas')
        .update(updates)
        .eq('id', id)
        .select();
    if (error) throw error;
    return data;
}

// Eliminar reserva
async function deleteReserva(id) {
    const { error } = await supabase
        .from('reservas')
        .delete()
        .eq('id', id);
    if (error) throw error;
}

// Crear factura
async function createFactura(facturaData) {
    const { data, error } = await supabase
        .from('facturas')
        .insert([facturaData])
        .select();
    if (error) throw error;
    return data;
}

// Obtener usuarios (solo admin)
async function getUsuarios() {
    const { data, error } = await supabase
        .from('usuario')
        .select('id, nombre, email, rol, fecha_registro');
    if (error) throw error;
    return data;
}

// Exportar para uso global
window.supabaseClient = {
    client: supabase,
    auth: {
        login: supabaseLogin,
        register: supabaseRegister,
        logout: supabaseLogout,
        getCurrentUser
    },
    db: {
        getDestinos,
        getDestinoById,
        createReserva,
        getUserReservas,
        getAllReservas,
        updateReserva,
        deleteReserva,
        createFactura,
        getUsuarios
    }
};

console.log('✅ Supabase client configurado correctamente');
