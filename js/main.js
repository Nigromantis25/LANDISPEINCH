// ===== DATOS DE DESTINOS =====
const destinations = [
    {
        id: 1,
        name: "Paris, Francia",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&h=400&fit=crop",
        rating: "4.9",
        price: "$1,299",
        description: "La ciudad del amor y las luces",
        duration: "5 días"
    },
    {
        id: 2,
        name: "Japón",
        image: "https://images.unsplash.com/photo-1522383150241-6959a2543b11?w=500&h=400&fit=crop",
        rating: "4.8",
        price: "$1,899",
        description: "Tradición y modernidad en armonía",
        duration: "7 días"
    },
    {
        id: 3,
        name: "Maldivas",
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&h=400&fit=crop",
        rating: "5.0",
        price: "$2,499",
        description: "Playas paradisiacas y arrecifes",
        duration: "6 días"
    },
    {
        id: 4,
        name: "Barcelona, España",
        image: "https://images.unsplash.com/photo-1583458332506-dead9b56a3e1?w=500&h=400&fit=crop",
        rating: "4.7",
        price: "$1,099",
        description: "Arquitectura única y cultura vibrante",
        duration: "4 días"
    },
    {
        id: 5,
        name: "Nueva York, USA",
        image: "https://images.unsplash.com/photo-1490728143518-7055cda97e90?w=500&h=400&fit=crop",
        rating: "4.8",
        price: "$1,499",
        description: "La ciudad que nunca duerme",
        duration: "5 días"
    },
    {
        id: 6,
        name: "Tailandia",
        image: "https://images.unsplash.com/photo-1528127269029-c440edc4b16d?w=500&h=400&fit=crop",
        rating: "4.9",
        price: "$899",
        description: "Templos antiguos y playas exóticas",
        duration: "6 días"
    }
];

// ===== DATOS DE PAQUETES =====
const packages = [
    {
        id: 1,
        name: "Luna de Miel Romántica",
        badge: "Popular",
        price: "$3,499",
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
        price: "$2,299",
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
        price: "$2,999",
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
        price: "$1,799",
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
        price: "$2,199",
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
        price: "$1,599",
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
        originalPrice: "$1,999",
        finalPrice: "$999",
        discount: "50%",
        dates: "Hasta 30 de septiembre"
    },
    {
        id: 2,
        name: "Descuento Aéreo",
        image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=300&fit=crop",
        originalPrice: "$1,599",
        finalPrice: "$1,099",
        discount: "30%",
        dates: "Hasta 31 de octubre"
    },
    {
        id: 3,
        name: "Fin de Año Fantástico",
        image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=300&fit=crop",
        originalPrice: "$2,599",
        finalPrice: "$1,799",
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
                <a href="#" class="cta-button secondary" onclick="openBooking(event, '${offer.name}')" style="width: 100%; text-align: center;">
                    <i class="fas fa-tag"></i> Aprovechar
                </a>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ===== ABRIR MODAL DE RESERVA =====
function openBooking(event, destination) {
    event.preventDefault();
    const modal = document.getElementById('bookingModal');
    const form = document.getElementById('bookingForm');
    const destInput = form.querySelector('input[type="text"][placeholder="Destino"]');
    destInput.value = destination;
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
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('¡Reserva confirmada! Nos contactaremos pronto');
            closeBooking();
            bookingForm.reset();
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
            showNotification('¡Bienvenido a Moverse!');
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

console.log('✈️ Moverse - Agencia de Turismo cargado correctamente');
