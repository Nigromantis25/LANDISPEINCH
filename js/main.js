const products = [
    {
        id: 1,
        name: "camiza Elegante",
        price: 299.99,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJDhtvLayZcf5c4QdHyqxvRSylvoUXM0d2Nw&s",
        description: "Camisa hombre elegante"
    },
    {
        id: 2,
        name: "Pantalón Casual",
        price: 499.99,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8lhdpYyHILeQeEX6VGx1cENz4ceSxypvZrw&s",
        description: "Pantalón casual para hombre"
    },
    {
        id: 3,
        name: "jean Deportiva",
        price: 799.99,
        image: "https://i.ebayimg.com/images/g/o5QAAOSwGQ9nLqCh/s-l1200.png",
        description: "jean de deporte  para hombre"
    },
    {
        id: 4,
        name: "Suéter Tejido",
        price: 399.99,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeBOlODyRXdt0n-YsvEWW0cQBqPnXdWSX6Zg&s",
        description: "Suéter de punto para hombre"
    },
    {
        id: 5,
        name: "Camiseta Básica",
        price: 449.99,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLEJfZWn_FFmEptuT1DwYMMfzFM3iPsy5fXg&s",
        description: "Camiseta básica para hombre"
    },
    {
        id: 6,
        name: "terno Formal",
        price: 899.99,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKi9ApOkY_YfXdwPsET7PDxlzK7O8i16WppQ&s",
        description: "terno formal para hombre"
    }
];

function loadProducts() {
    const productsGrid = document.querySelector('.products-grid');
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">$${product.price}</p>
                <button onclick="addToCart(${product.id})" class="cta-button">Agregar al Carrito</button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
}

let cart = [];
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.product.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            product: product,
            quantity: 1
        });
    }

    updateCartCount();
    showNotification('Producto agregado al carrito');
    updateCartModal();
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartModal() {
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.getElementById('cartTotal');
    
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        
        total += item.product.price * item.quantity;

        itemElement.innerHTML = `
            <img src="${item.product.image}" alt="${item.product.name}">
            <div>
                <h3>${item.product.name}</h3>
                <p>$${item.product.price.toFixed(2)}</p>
            </div>
            <div class="item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.product.id}, ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.product.id}, ${item.quantity + 1})">+</button>
            </div>
            <button class="quantity-btn" onclick="removeFromCart(${item.product.id})">&times;</button>
        `;

        cartItems.appendChild(itemElement);
    });

    cartTotal.textContent = total.toFixed(2);
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }

    const cartItem = cart.find(item => item.product.id === productId);
    if (cartItem) {
        cartItem.quantity = newQuantity;
        updateCartCount();
        updateCartModal();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.product.id !== productId);
    updateCartCount();
    updateCartModal();
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        showNotification('Mensaje enviado correctamente');
        contactForm.reset();
    });
}
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// carrito
const cartModal = document.getElementById('cartModal');
const closeCart = document.querySelector('.close-cart');
const cartIcon = document.querySelector('.cart-icon');

cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'block';
    updateCartModal();
});

closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Facturación
const checkoutButton = document.getElementById('checkoutButton');
const checkoutForm = document.getElementById('checkoutForm');
const invoice = document.getElementById('invoice');

checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('El carrito está vacío');
        return;
    }
    checkoutForm.style.display = 'block';
    invoice.style.display = 'none';
});

checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Genera
    document.getElementById('invoiceDate').textContent = new Date().toLocaleDateString();
    document.getElementById('invoiceNombre').textContent = document.getElementById('nombre').value;
    document.getElementById('invoiceEmail').textContent = document.getElementById('email').value;
    document.getElementById('invoiceTelefono').textContent = document.getElementById('telefono').value;
    document.getElementById('invoiceDireccion').textContent = document.getElementById('direccion').value;

    const invoiceItems = document.getElementById('invoiceItems');
    invoiceItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const row = document.createElement('tr');
        const itemTotal = item.product.price * item.quantity;
        total += itemTotal;

        row.innerHTML = `
            <td>${item.product.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.product.price.toFixed(2)}</td>
            <td>$${itemTotal.toFixed(2)}</td>
        `;

        invoiceItems.appendChild(row);
    });

    document.getElementById('invoiceTotal').textContent = total.toFixed(2);

    checkoutForm.style.display = 'none';
    invoice.style.display = 'block';
});

// Cargar productos 
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
});

// Login modal: 
document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLogin = document.querySelector('#loginModal .close-login');

    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', () => {
            loginModal.style.display = 'flex';
        });
    }

    if (closeLogin) {
        closeLogin.addEventListener('click', () => {
            loginModal.style.display = 'none';
        });
    }

    // click fuera del contenido
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });
});