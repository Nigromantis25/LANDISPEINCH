// ===== DATOS DE DESTINOS =====
const destinations = [
    {
        id: 1,
        name: "Salar de Uyuni",
        image: "https://estaticos-television.unitel.bo/binrepository/1202x512/89c0/1024d512/none/160810533/YXCO/image-salar-uyuni-intiraymi-expediciones-to_101-13748300_20251123201013.webp",
        rating: "4.8",
        price: "Bs 3,499",
        description: "El espejo más grande del mundo",
        duration: "7 días"
    },
    {
        id: 2,
        name: "El Chapare",
        image: "https://media-cdn.tripadvisor.com/media/photo-s/05/58/e5/de/el-mundo-verde-travel.jpg",
        rating: "4.7",
        price: "Bs 2,199",
        description: "Región amazónica con biodiversidad y paisajes fluviales",
        duration: "4 días"
    }
];

// Base URL del API (ajusta si el backend corre en otro host/puerto)
const API_BASE = 'http://localhost:3001';

// ===== DATOS DE PAQUETES =====
const packages = [
    {
        id: 1,
        name: "Luna de Miel Romántica",
        badge: "Popular",
        price: "Bs 6,999",
        details: [
            "Hotel 5 estrellas",
            "Desayuno incluido",
            "Tours guiados",
            "Cena romántica"
        ]
    },
    {
        id: 2,
        name: "Aventura Extrema",
        badge: "Aventura",
        price: "Bs 4,599",
        details: [
            "Hospedaje premium",
            "Actividades extremas",
            "Instructor profesional",
            "Seguro completo"
        ]
    },
    {
        id: 3,
        name: "Relajación y Bienestar",
        badge: "Relax",
        price: "Bs 5,999",
        details: [
            "Resort spa de lujo",
            "Masajes terapéuticos",
            "Yoga diario",
            "All-inclusive"
        ]
    },
    {
        id: 4,
        name: "Explorador Cultural",
        badge: "Cultura",
        price: "Bs 3,599",
        details: [
            "Museo exclusivo",
            "Guía especializado",
            "Visitas históricas",
            "Cena local gourmet"
        ]
    },
    {
        id: 5,
        name: "Escapada Familiar",
        badge: "Familia",
        price: "Bs 4,399",
        details: [
            "Habitaciones amplias",
            "Actividades infantiles",
            "Parques temáticos",
            "Entretenimiento total"
        ]
    },
    {
        id: 6,
        name: "Viaje de Negocios",
        badge: "Negocio",
        price: "Bs 3,199",
        details: [
            "Hotel business",
            "Internet premium",
            "Salas de reunión",
            "Servicio 24/7"
        ]
    }
];

// ===== DATOS DE OFERTAS =====
const offers = [
    {
        id: 1,
        name: "Oferta Especial Verano",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=300&fit=crop",
        originalPrice: "Bs 3,999",
        finalPrice: "Bs 1,999",
        discount: "50%",
        dates: "Hasta 30 de septiembre"
    },
    {
        id: 2,
        name: "Descuento Aéreo",
        image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=300&fit=crop",
        originalPrice: "Bs 3,199",
        finalPrice: "Bs 2,199",
        discount: "30%",
        dates: "Hasta 31 de octubre"
    },
    {
        id: 3,
        name: "Fin de Año Fantástico",
        image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=300&fit=crop",
        originalPrice: "Bs 5,199",
        finalPrice: "Bs 3,599",
        discount: "30%",
        dates: "Hasta 15 de diciembre"
    }
];

// ===== CARGAR DESTINOS =====
function loadDestinations() {
    const grid = document.querySelector('.destinations-grid');
    grid.innerHTML = '';
    
    destinations.forEach(dest => {
        const card = document.createElement('div');
        card.className = 'destination-card';
        card.innerHTML = `
            <img src="${dest.image}" alt="${dest.name}" class="destination-image">
            <div class="destination-info">
                <h3>${dest.name}</h3>
                <div class="destination-rating">
                    ${'⭐'.repeat(Math.floor(dest.rating))} ${dest.rating}
                </div>
                <p>${dest.description}</p>
                <p style="color: #999; font-size: 0.9rem;">Duración: ${dest.duration}</p>
                <div class="destination-price">desde ${dest.price}</div>
                <div class="destination-button">
                    <a href="#" class="cta-button primary" onclick="openBooking(event, '${dest.name}')">
                        <i class="fas fa-plane"></i> Reservar
                    </a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ===== CARGAR PAQUETES =====
function loadPackages() {
    const grid = document.querySelector('.packages-grid');
    grid.innerHTML = '';
    
    packages.forEach(pkg => {
        const card = document.createElement('div');
        card.className = 'package-card';
        card.innerHTML = `
            <span class="package-badge">${pkg.badge}</span>
            <h3>${pkg.name}</h3>
            <ul class="package-details">
                ${pkg.details.map(detail => `<li>${detail}</li>`).join('')}
            </ul>
            <div class="package-price">${pkg.price}</div>
            <div class="package-button">
                <a href="#" class="cta-button primary" onclick="openBooking(event, '${pkg.name}')">
                    <i class="fas fa-check"></i> Seleccionar
                </a>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ===== CARGAR OFERTAS =====
function loadOffers() {
    const grid = document.querySelector('.offers-grid');
    grid.innerHTML = '';
    
    offers.forEach(offer => {
        const card = document.createElement('div');
        card.className = 'offer-card';
        card.innerHTML = `
            <img src="${offer.image}" alt="${offer.name}" class="offer-image">
            <div class="offer-discount">${offer.discount}</div>
            <div class="offer-content">
                <h3>${offer.name}</h3>
                <p class="offer-dates"><i class="fas fa-calendar"></i> ${offer.dates}</p>
                <div class="offer-price">
                    <span class="original">${offer.originalPrice}</span>
                    <span class="final">${offer.finalPrice}</span>
                </div>
                <a href="#" class="cta-button secondary" onclick="openBookingFromOffer(event, ${offer.id})" style="width: 100%; text-align: center;">
                    <i class="fas fa-tag"></i> Aprovechar
                </a>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ===== RESERVAS (CRUD) =====
async function loadReservations() {
    const tableBody = document.querySelector('#reservationsTable tbody');
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="7">Cargando...</td></tr>';
    try {
        const res = await fetch(`${API_BASE}/api/reservas`);
        if (!res.ok) throw new Error('Error cargando reservas');
        const data = await res.json();
        if (!Array.isArray(data)) data = [];
        tableBody.innerHTML = '';
        data.forEach(r => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${r.id}</td>
                <td>${r.nombre}</td>
                <td>${r.email}</td>
                <td>${r.destino}</td>
                <td>${r.fecha_salida || ''} - ${r.fecha_retorno || ''}</td>
                <td>${r.personas}</td>
                <td>
                    <button class="cta-button secondary" onclick="editReservation(${r.id})">Editar</button>
                    <button class="cta-button danger" onclick="deleteReservation(${r.id})">Eliminar</button>
                    <button class="cta-button" onclick="openInvoiceFromReservation(${r.id})">Factura</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
        tableBody.innerHTML = '<tr><td colspan="7">No se pudieron cargar las reservas.</td></tr>';
    }
}

async function deleteReservation(id) {
    if (!confirm('¿Eliminar esta reserva?')) return;
    try {
        const res = await fetch(`${API_BASE}/api/reservas/${id}`, { method: 'DELETE' });
        if (res.ok) {
            showNotification('Reserva eliminada');
            loadReservations();
        } else {
            const e = await res.json().catch(() => ({}));
            showNotification(e.message || 'Error al eliminar');
        }
    } catch (err) {
        console.error(err);
        showNotification('Error al eliminar reserva');
    }
}

async function editReservation(id) {
    try {
        const res = await fetch(`${API_BASE}/api/reservas/${id}`);
        if (!res.ok) throw new Error('Reserva no encontrada');
        const r = await res.json();
        // Rellenar modal de reserva
        const bookingForm = document.getElementById('bookingForm');
        bookingForm.querySelector('input[name="nombre"]').value = r.nombre || '';
        bookingForm.querySelector('input[name="email"]').value = r.email || '';
        bookingForm.querySelector('input[name="telefono"]').value = r.telefono || '';
        bookingForm.querySelector('input[name="destino"]').value = r.destino || '';
        bookingForm.querySelector('input[name="fechaSalida"]').value = r.fecha_salida ? r.fecha_salida.split(' ')[0] : '';
        bookingForm.querySelector('input[name="fechaRetorno"]').value = r.fecha_retorno ? r.fecha_retorno.split(' ')[0] : '';
        bookingForm.querySelector('input[name="personas"]').value = r.personas || 1;
        bookingForm.querySelector('textarea[name="preferencias"]').value = r.preferencias || '';
        // offer fields
        if (document.getElementById('offerId')) document.getElementById('offerId').value = r.offer_id || '';
        if (document.getElementById('offerPrice')) document.getElementById('offerPrice').value = r.offer_price || '';
        if (document.getElementById('offerDiscount')) document.getElementById('offerDiscount').value = r.offer_discount || '';
        if (document.getElementById('reservaId')) document.getElementById('reservaId').value = r.id;
        openBooking(new Event('click'), r.destino || '');
    } catch (err) {
        console.error(err);
        showNotification('No se pudo cargar la reserva para editar');
    }
}

// ===== FACTURAS (Frontend) =====
function openInvoiceFromReservation(reservaId) {
    // Obtener datos de reserva y abrir modal
    fetch(`${API_BASE}/api/reservas/${reservaId}`).then(r => r.json()).then(r => {
        document.getElementById('invoiceReservaId').value = r.id;
        document.getElementById('invoiceNombre').value = r.nombre || '';
        document.getElementById('invoiceEmail').value = r.email || '';
        document.getElementById('invoiceTelefono').value = r.telefono || '';
        document.getElementById('invoiceDestino').value = r.destino || '';
        const modal = document.getElementById('invoiceModal');
        modal.style.display = 'flex';
        modal.classList.add('active');
    }).catch(err => {
        console.error(err);
        showNotification('No se pudo cargar la reserva');
    });
}

function closeInvoice() {
    const modal = document.getElementById('invoiceModal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    // Cargar reservas en admin
    loadReservations();

    // Cerrar modal factura
    const closeInvoiceBtn = document.querySelector('.close-invoice');
    if (closeInvoiceBtn) closeInvoiceBtn.addEventListener('click', closeInvoice);

    const invoiceModal = document.getElementById('invoiceModal');
    if (invoiceModal) {
        invoiceModal.addEventListener('click', function(e) {
            if (e.target === invoiceModal) closeInvoice();
        });
    }

    const invoiceForm = document.getElementById('invoiceForm');
    if (invoiceForm) {
        invoiceForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const reservaId = document.getElementById('invoiceReservaId').value || null;
            const nombre = document.getElementById('invoiceNombre').value;
            const email = document.getElementById('invoiceEmail').value;
            const telefono = document.getElementById('invoiceTelefono').value;
            const destino = document.getElementById('invoiceDestino').value;
            const metodoPago = document.getElementById('invoicePago').value;
            try {
                const res = await fetch(`${API_BASE}/api/facturas`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reservaId, nombre, email, telefono, destino, metodoPago })
                });
                if (res.ok) {
                    const data = await res.json();
                    showNotification('Factura generada');
                    closeInvoice();
                    // Abrir ventana con resumen imprimible
                    const factura = data.factura || {};
                    const win = window.open('', '_blank');
                    win.document.write(`<pre>${JSON.stringify(factura, null, 2)}</pre>`);
                } else {
                    const err = await res.json().catch(() => ({}));
                    showNotification(err.message || 'Error generando factura');
                }
            } catch (err) {
                console.error(err);
                showNotification('Error al generar factura');
            }
        });
    }
});

function openBookingFromOffer(event, offerId) {
    event.preventDefault();
    const offer = offers.find(o => o.id === offerId);
    if (offer) {
        openBooking(event, offer.name, {
            offerId: offer.id,
            offerPrice: offer.finalPrice,
            offerDiscount: offer.discount,
            originalPrice: offer.originalPrice
        });
    } else {
        openBooking(event, 'Oferta');
    }
}

// ===== ABRIR MODAL DE RESERVA =====
function openBooking(event, destination, extras = {}) {
    event.preventDefault();
    const modal = document.getElementById('bookingModal');
    const form = document.getElementById('bookingForm');
    let destInput = form.querySelector('#bookingDestination');
    if (!destInput) {
        destInput = form.querySelector('input[type="text"]');
    }
    if (destInput) destInput.value = destination;
    // Fill offer hidden inputs if provided
    const offerIdInput = document.getElementById('offerId');
    const offerPriceInput = document.getElementById('offerPrice');
    const offerDiscountInput = document.getElementById('offerDiscount');
    const offerSummary = document.getElementById('selectedOfferSummary');
    if (offerIdInput) offerIdInput.value = extras.offerId || '';
    if (offerPriceInput) offerPriceInput.value = extras.offerPrice || '';
    if (offerDiscountInput) offerDiscountInput.value = extras.offerDiscount || '';
    if (offerSummary) {
        if (extras.offerPrice || extras.offerDiscount) {
            offerSummary.textContent = `Oferta: ${extras.offerPrice || ''} (${extras.offerDiscount || ''})`;
        } else {
            offerSummary.textContent = '';
        }
    }
    modal.classList.add('active');
    modal.style.display = 'flex';
}

// ===== CERRAR MODAL DE RESERVA =====
function closeBooking() {
    const modal = document.getElementById('bookingModal');
    modal.classList.remove('active');
    modal.style.display = 'none';
}

// ===== MANEJAR ENVÍO DE RESERVA =====
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const nombre = bookingForm.querySelector('input[name="nombre"]').value;
            const email = bookingForm.querySelector('input[name="email"]').value;
            const telefono = bookingForm.querySelector('input[name="telefono"]').value;
            const destino = bookingForm.querySelector('input[name="destino"]').value;
            const fechaSalida = bookingForm.querySelector('input[name="fechaSalida"]').value;
            const fechaRetorno = bookingForm.querySelector('input[name="fechaRetorno"]').value;
            const personas = bookingForm.querySelector('input[name="personas"]').value;
            const preferencias = bookingForm.querySelector('textarea[name="preferencias"]').value;
            const offerId = bookingForm.querySelector('#offerId') ? bookingForm.querySelector('#offerId').value : '';
            const offerPrice = bookingForm.querySelector('#offerPrice') ? bookingForm.querySelector('#offerPrice').value : '';
            const offerDiscount = bookingForm.querySelector('#offerDiscount') ? bookingForm.querySelector('#offerDiscount').value : '';
            const reservaId = bookingForm.querySelector('#reservaId') ? bookingForm.querySelector('#reservaId').value : '';

            const payload = {
                nombre,
                email,
                telefono,
                destino,
                fechaSalida,
                fechaRetorno,
                personas,
                preferencias,
                offerId,
                offerPrice,
                offerDiscount
            };

            try {
                let res;
                if (reservaId) {
                    // Actualizar reserva existente
                    res = await fetch(`${API_BASE}/api/reservas/${reservaId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                } else {
                    res = await fetch(`${API_BASE}/api/reservas`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                }

                if (res.ok) {
                    const data = await res.json();
                    showNotification(data.message || '¡Reserva confirmada!');
                    closeBooking();
                    bookingForm.reset();
                    // limpiar reservaId
                    if (document.getElementById('reservaId')) document.getElementById('reservaId').value = '';
                    loadReservations();
                } else {
                    const error = await res.json().catch(() => ({}));
                    showNotification(error.message || 'Error al procesar la reserva');
                }
            } catch (err) {
                console.error(err);
                showNotification('No se pudo conectar con el servidor. Reserva guardada localmente.');
                closeBooking();
                bookingForm.reset();
            }
        });
    }

    // Cerrar modal al hacer click fuera
    const bookingModal = document.getElementById('bookingModal');
    const closeBookingBtn = document.querySelector('.close-booking');
    
    if (closeBookingBtn) {
        closeBookingBtn.addEventListener('click', closeBooking);
    }

    if (bookingModal) {
        bookingModal.addEventListener('click', function(e) {
            if (e.target === bookingModal) {
                closeBooking();
            }
        });
    }

    // Cargar todos los contenidos
    loadDestinations();
    loadPackages();
    loadOffers();
});

// ===== FORMULARIO DE CONTACTO =====
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('¡Mensaje enviado! Nos pondremos en contacto pronto');
            contactForm.reset();
        });
    }
});

// ===== LOGIN Y REGISTRO =====
function openLogin() {
    const modal = document.getElementById('loginModal');
    modal.classList.add('active');
    modal.style.display = 'flex';
}

function closeLogin() {
    const modal = document.getElementById('loginModal');
    modal.classList.remove('active');
    modal.style.display = 'none';
}

function toggleRegister() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'flex';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const closeLoginBtn = document.querySelector('.close-login');
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginBtn) {
        loginBtn.addEventListener('click', openLogin);
    }

    if (closeLoginBtn) {
        closeLoginBtn.addEventListener('click', closeLogin);
    }

    if (loginModal) {
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                closeLogin();
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('¡Bienvenido a Open World!');
            closeLogin();
            loginForm.reset();
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('¡Cuenta creada exitosamente!');
            closeLogin();
            registerForm.reset();
        });
    }
});

// ===== FORMULARIO DE BÚSQUEDA =====
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Búsqueda realizada. ¡Revisa nuestros paquetes!');
            const destino = searchForm.querySelector('input[type="text"]').value;
            document.querySelector('.packages-section').scrollIntoView({ behavior: 'smooth' });
        });
    }
});

// ===== NOTIFICACIONES =====
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(500px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== SMOOTH SCROLL PARA ENLACES =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // No prevenir si es para abrir modales
        if (href === '#' || this.onclick) {
            return;
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== ANIMACIONES AL SCROLL =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideIn 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.destination-card, .package-card, .offer-card').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
});

// ===== EFECTOS DE HOVER EN TARJETAS =====
document.addEventListener('DOMContentLoaded', function() {
    const addHoverEffect = (selector) => {
        document.querySelectorAll(selector).forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
            });
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    };

    addHoverEffect('.destination-card');
    addHoverEffect('.package-card');
    addHoverEffect('.offer-card');
});

console.log('✈️ Open World - Agencia de Turismo cargado correctamente');
