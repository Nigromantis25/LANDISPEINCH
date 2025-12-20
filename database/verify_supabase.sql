-- Verificación rápida para Supabase / PostgreSQL
-- Ejecuta este script en SQL Editor del proyecto Supabase después de cargar openworld_postgres.sql

-- Conteos
SELECT 'destinos' AS tabla, COUNT(*) AS filas FROM destinos;
SELECT 'actividades' AS tabla, COUNT(*) AS filas FROM actividades;
SELECT 'gastronomia' AS tabla, COUNT(*) AS filas FROM gastronomia;
SELECT 'horarios' AS tabla, COUNT(*) AS filas FROM horarios;
SELECT 'imagenes' AS tabla, COUNT(*) AS filas FROM imagenes;
SELECT 'usuario' AS tabla, COUNT(*) AS filas FROM usuario;
SELECT 'reservas' AS tabla, COUNT(*) AS filas FROM reservas;
SELECT 'facturas' AS tabla, COUNT(*) AS filas FROM facturas;

-- Muestras
SELECT * FROM destinos LIMIT 5;
SELECT * FROM reservas ORDER BY fecha_reserva DESC LIMIT 5;

-- Comprobar secuencias
SELECT pg_get_serial_sequence('destinos','id') AS seq, last_value FROM destinos_id_seq;
SELECT pg_get_serial_sequence('reservas','id') AS seq, last_value FROM reservas_id_seq;

-- Si tienes errores por permisos, asegúrate de ejecutar como role con privilegios (o usar el SQL Editor del Dashboard).
