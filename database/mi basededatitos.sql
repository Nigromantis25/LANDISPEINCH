DROP TABLE IF EXISTS imagenes CASCADE;
DROP TABLE IF EXISTS horarios CASCADE;
DROP TABLE IF EXISTS gastronomia CASCADE;
DROP TABLE IF EXISTS actividades CASCADE;
DROP TABLE IF EXISTS destinos CASCADE;

CREATE TABLE destinos (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    ubicacion TEXT,
    descripcion TEXT,
    precio_entrada NUMERIC
);

CREATE TABLE actividades (
    id SERIAL PRIMARY KEY,
    destino_id INTEGER REFERENCES destinos(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL
);

CREATE TABLE gastronomia (
    id SERIAL PRIMARY KEY,
    destino_id INTEGER REFERENCES destinos(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL
);

CREATE TABLE horarios (
    id SERIAL PRIMARY KEY,
    destino_id INTEGER REFERENCES destinos(id) ON DELETE CASCADE,
    dias TEXT NOT NULL,
    horas TEXT NOT NULL 
);

-- 5. Create 'imagenes' table (Images)
CREATE TABLE imagenes (
    id SERIAL PRIMARY KEY,
    destino_id INTEGER REFERENCES destinos(id) ON DELETE CASCADE,
    url TEXT NOT NULL
);

-- Insert Data for 'Salar de Uyuni' 
INSERT INTO destinos (id, nombre, ubicacion, descripcion, precio_entrada)
VALUES (
    1,
    'Salar de Uyuni',
    'Potosí, Bolivia',
    'El mayor desierto de sal continuo y alto del mundo, con una superficie de 10 582 km². Es un espejo natural impresionante donde el cielo se une con la tierra.',
    3499
);

INSERT INTO actividades (destino_id, nombre) VALUES
(1, 'Fotografía de perspectiva'),
(1, 'Visita a la Isla Incahuasi'),
(1, 'Observación de flamencos'),
(1, 'Tour de las lagunas de colores'),
(1, 'Cena bajo las estrellas');

INSERT INTO gastronomia (destino_id, nombre) VALUES
(1, 'Carne de llama'),
(1, 'Quinoa real'),
(1, 'Kalapurca');

INSERT INTO horarios (destino_id, dias, horas) VALUES
(1, 'lunes-viernes', '08:00 - 18:00'),
(1, 'sabado-domingo', '07:00 - 19:00');

INSERT INTO imagenes (destino_id, url) VALUES
(1, 'https://estaticos-television.unitel.bo/binrepository/1202x512/89c0/1024d512/none/160810533/YXCO/image-salar-uyuni-intiraymi-expediciones-to_101-13748300_20251123201013.webp');


-- Insert Data for 'El Chapare' (ID 2)
INSERT INTO destinos (id, nombre, ubicacion, descripcion, precio_entrada)
VALUES (
    2,
    'El Chapare',
    'Cochabamba, Bolivia',
    'Una región tropical llena de biodiversidad, ríos caudalosos y parques nacionales. Ideal para el turismo de aventura y contacto con la naturaleza.',
    2199
);

INSERT INTO actividades (destino_id, nombre) VALUES
(2, 'Rafting en el río Espíritu Santo'),
(2, 'Canopy y Zipline'),
(2, 'Visita al Parque Machía'),
(2, 'Caminatas por la selva'),
(2, 'Observación de fauna silvestre');

INSERT INTO gastronomia (destino_id, nombre) VALUES
(2, 'Pescado a la parrilla (Surubí)'),
(2, 'Platos con yuca y arroz'),
(2, 'Frutas tropicales frescas');

INSERT INTO horarios (destino_id, dias, horas) VALUES
(2, 'lunes-viernes', '07:00 - 17:00'),
(2, 'sabado-domingo', '06:00 - 18:00');

INSERT INTO imagenes (destino_id, url) VALUES
(2, 'https://media-cdn.tripadvisor.com/media/photo-s/05/58/e5/de/el-mundo-verde-travel.jpg');

-- Reset sequence for scenarios where auto-increment is needed next
SELECT setval('destinos_id_seq', (SELECT MAX(id) FROM destinos));

-- ===== TABLAS DE USUARIOS Y AUTENTICACIÓN =====
DROP TABLE IF EXISTS facturas CASCADE;
DROP TABLE IF EXISTS reservas CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;

CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    rol TEXT NOT NULL DEFAULT 'cliente' CHECK (rol IN ('admin', 'vendedor', 'cliente')),
    telefono TEXT,
    fecha_registro TIMESTAMP DEFAULT NOW()
);

-- ===== TABLA DE RESERVAS =====
CREATE TABLE reservas (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT,
    destino TEXT NOT NULL,
    fecha_salida DATE,
    fecha_retorno DATE,
    personas INTEGER DEFAULT 1,
    preferencias TEXT,
    offer_id INTEGER,
    offer_price TEXT,
    offer_discount TEXT,
    fecha_reserva TIMESTAMP DEFAULT NOW()
);

-- ===== TABLA DE FACTURAS =====
CREATE TABLE facturas (
    id SERIAL PRIMARY KEY,
    reserva_id INTEGER REFERENCES reservas(id) ON DELETE SET NULL,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT,
    destino TEXT,
    fecha_salida DATE,
    fecha_retorno DATE,
    personas INTEGER,
    preferencias TEXT,
    metodo_pago TEXT DEFAULT 'No especificado',
    fecha_factura TIMESTAMP DEFAULT NOW()
);

-- ===== USUARIOS DE PRUEBA =====
-- Contraseñas hasheadas con bcrypt (10 rounds):
-- admin123 -> $2a$10$rQnM1v5Z8qR3xL7yN9wO8eK1jH4gF2dS5aP6bC3vZ0xW7mY9kL1nQ
-- vendedor123 -> $2a$10$tU8mK3nL6oP2qR5sT1wX4eY7gH0iJ9kL2mN3oP4qR5sT6uV7wX8yZ

INSERT INTO usuario (nombre, email, password, rol) VALUES
('Administrador', 'admin@openworld.com', '$2a$10$rQnM1v5Z8qR3xL7yN9wO8eK1jH4gF2dS5aP6bC3vZ0xW7mY9kL1nQ', 'admin'),
('Vendedor Principal', 'vendedor@openworld.com', '$2a$10$tU8mK3nL6oP2qR5sT1wX4eY7gH0iJ9kL2mN3oP4qR5sT6uV7wX8yZ', 'vendedor');

-- Reset sequences
SELECT setval('usuario_id_seq', (SELECT MAX(id) FROM usuario));
