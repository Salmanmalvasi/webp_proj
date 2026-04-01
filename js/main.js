// Tesla Website Clone - Main JavaScript

// ===== Constants =====
const MODELS = {
  'model-s': {
    name: 'Model S',
    basePrice: 74990,
    image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-S-Main-Hero-Desktop-LHD.jpg',
    specs: {
      range: '405 mi',
      acceleration: '1.99s',
      topSpeed: '200 mph',
      peakPower: '1,020 hp'
    }
  },
  'model-3': {
    name: 'Model 3',
    basePrice: 40240,
    image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-3-Main-Hero-Desktop-LHD.jpg',
    specs: {
      range: '333 mi',
      acceleration: '3.1s',
      topSpeed: '162 mph',
      peakPower: '510 hp'
    }
  },
  'model-x': {
    name: 'Model X',
    basePrice: 79990,
    image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-X-Main-Hero-Desktop-LHD.jpg',
    specs: {
      range: '348 mi',
      acceleration: '2.5s',
      topSpeed: '163 mph',
      peakPower: '1,020 hp'
    }
  },
  'model-y': {
    name: 'Model Y',
    basePrice: 44990,
    image: 'https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=800&q=80',
    specs: {
      range: '330 mi',
      acceleration: '3.5s',
      topSpeed: '155 mph',
      peakPower: '456 hp'
    }
  },
  'cybertruck': {
    name: 'Cybertruck',
    basePrice: 99990,
    image: 'images/cybertruck-main.jpg',
    specs: {
      range: '340 mi',
      acceleration: '2.6s',
      topSpeed: '130 mph',
      peakPower: '845 hp'
    }
  }
};

const VARIANTS = {
  'model-s': [
    { id: 'standard', name: 'Model S', price: 0 },
    { id: 'plaid', name: 'Model S Plaid', price: 20000 }
  ],
  'model-3': [
    { id: 'standard', name: 'Model 3', price: 0 },
    { id: 'long-range', name: 'Model 3 Long Range', price: 7000 },
    { id: 'performance', name: 'Model 3 Performance', price: 12000 }
  ],
  'model-x': [
    { id: 'standard', name: 'Model X', price: 0 },
    { id: 'plaid', name: 'Model X Plaid', price: 20000 }
  ],
  'model-y': [
    { id: 'standard', name: 'Model Y', price: 0 },
    { id: 'long-range', name: 'Model Y Long Range', price: 5000 },
    { id: 'performance', name: 'Model Y Performance', price: 9000 }
  ],
  'cybertruck': [
    { id: 'rear-wheel', name: 'Cybertruck', price: 0 },
    { id: 'all-wheel', name: 'Cybertruck AWD', price: 20000 },
    { id: 'cyberbeast', name: 'Cyberbeast', price: 30000 }
  ]
};

const COLORS = [
  { id: 'pearl-white', name: 'Pearl White Multi-Coat', hex: '#e8e8e8', price: 0 },
  { id: 'solid-black', name: 'Solid Black', hex: '#212121', price: 1500 },
  { id: 'midnight-silver', name: 'Midnight Silver Metallic', hex: '#42464a', price: 1500 },
  { id: 'deep-blue', name: 'Deep Blue Metallic', hex: '#1e3a5f', price: 1500 },
  { id: 'ultra-red', name: 'Ultra Red', hex: '#a82833', price: 2500 },
  { id: 'quicksilver', name: 'Quicksilver', hex: '#8b8d8f', price: 2500 }
];

const INTERIORS = [
  { id: 'black', name: 'All Black', price: 0 },
  { id: 'white', name: 'Black and White', price: 1500 },
  { id: 'cream', name: 'Cream', price: 1500 }
];

const WHEELS = {
  'model-s': [
    { id: '19-tempest', name: '19" Tempest Wheels', price: 0 },
    { id: '21-arachnid', name: '21" Arachnid Wheels', price: 4500 }
  ],
  'model-3': [
    { id: '18-aero', name: '18" Aero Wheels', price: 0 },
    { id: '19-sport', name: '19" Sport Wheels', price: 1500 }
  ],
  'model-x': [
    { id: '20-cyberstream', name: '20" Cyberstream Wheels', price: 0 },
    { id: '22-turbine', name: '22" Turbine Wheels', price: 5500 }
  ],
  'model-y': [
    { id: '19-gemini', name: '19" Gemini Wheels', price: 0 },
    { id: '20-induction', name: '20" Induction Wheels', price: 2000 }
  ],
  'cybertruck': [
    { id: '20-standard', name: '20" All-Terrain Wheels', price: 0 },
    { id: '22-road', name: '22" Road Wheels', price: 3500 }
  ]
};

const AUTOPILOT = [
  { id: 'standard', name: 'Basic Autopilot', price: 0 },
  { id: 'enhanced', name: 'Enhanced Autopilot', price: 6000 },
  { id: 'fsd', name: 'Full Self-Driving', price: 12000 }
];

// ===== State Management =====
let cart = JSON.parse(localStorage.getItem('teslaCart')) || [];

// ===== Utility Functions =====
function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

function saveCart() {
  localStorage.setItem('teslaCart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const countElements = document.querySelectorAll('.cart-count');
  countElements.forEach(el => {
    if (cart.length > 0) {
      el.textContent = cart.length;
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });
}

function showToast(message) {
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg class="toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ===== Navigation =====
function initNavigation() {
  const nav = document.querySelector('.nav');
  
  // Add Account or Sign In link next to cart
  const cartLink = document.querySelector('.nav__cart');
  if (cartLink && !document.querySelector('.nav__auth')) {
    const isAuth = localStorage.getItem('token');
    let user = null;
    try { user = JSON.parse(localStorage.getItem('user')); } catch (e) {}

    const authLinkText = isAuth ? 'Account' : 'Sign In';
    
    // Determine path depth
    const inSubFolder = window.location.pathname.includes('/models/');
    const prefix = inSubFolder ? '../' : '';
    
    // Admin Link?
    if (isAuth && user && user.isAdmin) {
      const adminLink = document.createElement('a');
      adminLink.href = prefix + 'admin.html';
      adminLink.className = 'nav__link';
      adminLink.textContent = 'Admin';
      cartLink.parentNode.insertBefore(adminLink, cartLink);
    }

    const authLink = document.createElement('a');
    authLink.href = prefix + (isAuth ? 'account.html' : 'login.html');
    authLink.className = 'nav__link nav__auth';
    authLink.textContent = authLinkText;
    
    cartLink.parentNode.insertBefore(authLink, cartLink);
  }

  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const mobileClose = document.querySelector('.mobile-menu__close');

  // Scroll effect
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.remove('nav--transparent');
        nav.classList.add('nav--solid');
      } else {
        nav.classList.remove('nav--solid');
        nav.classList.add('nav--transparent');
      }
    });
  }

  // Mobile menu
  if (hamburger && mobileMenu && mobileOverlay) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('active');
      mobileOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    const closeMenu = () => {
      mobileMenu.classList.remove('active');
      mobileOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (mobileClose) mobileClose.addEventListener('click', closeMenu);
    mobileOverlay.addEventListener('click', closeMenu);
  }
}

// ===== Homepage =====
function initHomepage() {
  // Scroll indicator
  const scrollIndicators = document.querySelectorAll('.hero__scroll');
  scrollIndicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
      const currentHero = indicator.closest('.hero');
      const nextSection = currentHero.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ===== Configuration Page =====
function initConfigPage() {
  const params = new URLSearchParams(window.location.search);
  const modelId = params.get('model') || 'model-3';
  
  const model = MODELS[modelId];
  if (!model) {
    window.location.href = 'index.html';
    return;
  }

  // Configuration state
  const config = {
    model: modelId,
    modelName: model.name,
    basePrice: model.basePrice,
    variant: VARIANTS[modelId][0],
    color: COLORS[0],
    interior: INTERIORS[0],
    wheels: WHEELS[modelId][0],
    autopilot: AUTOPILOT[0],
    image: model.image
  };

  // Render configuration options
  renderConfigOptions(modelId, config);
  updateConfigPreview(config);
  updateConfigPrice(config);

  // Event listeners for option selection
  document.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', () => {
      const type = card.dataset.type;
      const id = card.dataset.id;
      
      // Update selection UI
      card.parentElement.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      // Update config state
      switch (type) {
        case 'variant':
          config.variant = VARIANTS[modelId].find(v => v.id === id);
          break;
        case 'interior':
          config.interior = INTERIORS.find(i => i.id === id);
          break;
        case 'wheels':
          config.wheels = WHEELS[modelId].find(w => w.id === id);
          break;
        case 'autopilot':
          config.autopilot = AUTOPILOT.find(a => a.id === id);
          break;
      }
      
      updateConfigPrice(config);
    });
  });

  document.querySelectorAll('.color-option').forEach(colorBtn => {
    colorBtn.addEventListener('click', () => {
      const id = colorBtn.dataset.id;
      
      document.querySelectorAll('.color-option').forEach(c => c.classList.remove('selected'));
      colorBtn.classList.add('selected');
      
      config.color = COLORS.find(c => c.id === id);
      updateConfigPrice(config);
    });
  });

  // Add to cart button
  const addToCartBtn = document.querySelector('.config-add-cart');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      addToCart(config);
    });
  }
}

function renderConfigOptions(modelId, config) {
  // Set page title
  const pageTitle = document.querySelector('.config-preview__title');
  if (pageTitle) pageTitle.textContent = config.modelName;

  // Set image
  const previewImage = document.querySelector('.config-preview__image');
  if (previewImage) {
    previewImage.src = config.image;
    previewImage.alt = config.modelName;
  }

  // Variants
  const variantGrid = document.querySelector('[data-options="variant"]');
  if (variantGrid) {
    variantGrid.innerHTML = VARIANTS[modelId].map((v, i) => `
      <div class="option-card ${i === 0 ? 'selected' : ''}" data-type="variant" data-id="${v.id}">
        <div class="option-card__name">${v.name}</div>
        <div class="option-card__price">${v.price === 0 ? 'Included' : '+' + formatPrice(v.price)}</div>
      </div>
    `).join('');
  }

  // Colors
  const colorOptions = document.querySelector('.color-options');
  if (colorOptions) {
    colorOptions.innerHTML = COLORS.map((c, i) => `
      <button class="color-option ${i === 0 ? 'selected' : ''}" 
              data-id="${c.id}" 
              data-name="${c.name}"
              style="background-color: ${c.hex}"
              title="${c.name} ${c.price === 0 ? '(Included)' : '(+' + formatPrice(c.price) + ')'}">
      </button>
    `).join('');
  }

  // Interior
  const interiorGrid = document.querySelector('[data-options="interior"]');
  if (interiorGrid) {
    interiorGrid.innerHTML = INTERIORS.map((i, idx) => `
      <div class="option-card ${idx === 0 ? 'selected' : ''}" data-type="interior" data-id="${i.id}">
        <div class="option-card__name">${i.name}</div>
        <div class="option-card__price">${i.price === 0 ? 'Included' : '+' + formatPrice(i.price)}</div>
      </div>
    `).join('');
  }

  // Wheels
  const wheelsGrid = document.querySelector('[data-options="wheels"]');
  if (wheelsGrid) {
    wheelsGrid.innerHTML = WHEELS[modelId].map((w, i) => `
      <div class="option-card ${i === 0 ? 'selected' : ''}" data-type="wheels" data-id="${w.id}">
        <div class="option-card__name">${w.name}</div>
        <div class="option-card__price">${w.price === 0 ? 'Included' : '+' + formatPrice(w.price)}</div>
      </div>
    `).join('');
  }

  // Autopilot
  const autopilotGrid = document.querySelector('[data-options="autopilot"]');
  if (autopilotGrid) {
    autopilotGrid.innerHTML = AUTOPILOT.map((a, i) => `
      <div class="option-card ${i === 0 ? 'selected' : ''}" data-type="autopilot" data-id="${a.id}">
        <div class="option-card__name">${a.name}</div>
        <div class="option-card__price">${a.price === 0 ? 'Included' : '+' + formatPrice(a.price)}</div>
      </div>
    `).join('');
  }
}

function updateConfigPreview(config) {
  const previewPrice = document.querySelector('.config-preview__price');
  if (previewPrice) {
    const total = calculateConfigTotal(config);
    previewPrice.textContent = formatPrice(total);
  }
}

function updateConfigPrice(config) {
  const total = calculateConfigTotal(config);
  
  const previewPrice = document.querySelector('.config-preview__price');
  if (previewPrice) previewPrice.textContent = formatPrice(total);

  const summaryPrice = document.querySelector('.config-summary__price');
  if (summaryPrice) summaryPrice.textContent = formatPrice(total);
}

function calculateConfigTotal(config) {
  return config.basePrice + 
         config.variant.price + 
         config.color.price + 
         config.interior.price + 
         config.wheels.price + 
         config.autopilot.price;
}

function addToCart(config) {
  const item = {
    id: generateId(),
    model: config.model,
    modelName: config.modelName,
    variant: config.variant.name,
    color: config.color.name,
    interior: config.interior.name,
    wheels: config.wheels.name,
    autopilot: config.autopilot.name,
    image: config.image,
    price: calculateConfigTotal(config)
  };

  cart.push(item);
  saveCart();
  showToast(`${config.modelName} added to cart`);
}

// ===== Cart Page =====
function initCartPage() {
  renderCart();
}

function renderCart() {
  const cartItems = document.querySelector('.cart-items');
  const cartSummary = document.querySelector('.cart-summary');
  const cartEmpty = document.querySelector('.cart-empty');

  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.classList.add('hidden');
    if (cartSummary) cartSummary.classList.add('hidden');
    if (cartEmpty) cartEmpty.classList.remove('hidden');
    return;
  }

  if (cartEmpty) cartEmpty.classList.add('hidden');
  cartItems.classList.remove('hidden');
  if (cartSummary) cartSummary.classList.remove('hidden');

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item__image">
        <img src="${item.image}" alt="${item.modelName}">
      </div>
      <div class="cart-item__details">
        <h3>${item.variant}</h3>
        <p class="cart-item__config">${item.color}</p>
        <p class="cart-item__config">${item.interior} Interior</p>
        <p class="cart-item__config">${item.wheels}</p>
        <p class="cart-item__config">${item.autopilot}</p>
      </div>
      <div class="cart-item__actions">
        <span class="cart-item__price">${formatPrice(item.price)}</span>
        <button class="cart-item__remove" onclick="removeFromCart('${item.id}')">Remove</button>
      </div>
    </div>
  `).join('');

  updateCartSummary();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
  showToast('Item removed from cart');
}

function updateCartSummary() {
  const subtotalEl = document.querySelector('[data-summary="subtotal"]');
  const totalEl = document.querySelector('[data-summary="total"]');

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const fees = subtotal > 0 ? 1200 : 0; // Destination & documentation fee
  const total = subtotal + fees;

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (totalEl) totalEl.textContent = formatPrice(total);
}

// Make removeFromCart globally available
window.removeFromCart = removeFromCart;

// ===== Checkout Page =====
function initCheckoutPage() {
  renderCheckoutSummary();
  
  // Pre-fill user data if logged in
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      const emailInput = document.getElementById('email');
      const fnameInput = document.getElementById('firstName');
      const lnameInput = document.getElementById('lastName');
      
      if (emailInput && user.email) emailInput.value = user.email;
      if (fnameInput && user.firstName) fnameInput.value = user.firstName;
      if (lnameInput && user.lastName) lnameInput.value = user.lastName;
    }
  } catch (e) {
    console.error('Error parsing user data', e);
  }
  
  const form = document.querySelector('.checkout-form');
  if (form) {
    form.addEventListener('submit', handleCheckout);
  }
}

function renderCheckoutSummary() {
  const summaryContainer = document.querySelector('.checkout-order-summary');
  if (!summaryContainer) return;

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const fees = subtotal > 0 ? 1200 : 0;
  const total = subtotal + fees;

  let html = '<h4 class="checkout-order-summary__title">Order Summary</h4>';
  
  cart.forEach(item => {
    html += `
      <div class="checkout-order-item">
        <span>${item.variant}</span>
        <span>${formatPrice(item.price)}</span>
      </div>
    `;
  });

  if (fees > 0) {
    html += `
      <div class="checkout-order-item">
        <span>Destination & Documentation Fee</span>
        <span>${formatPrice(fees)}</span>
      </div>
    `;
  }

  html += `
    <div class="checkout-order-item">
      <span>Total</span>
      <span>${formatPrice(total)}</span>
    </div>
  `;

  summaryContainer.innerHTML = html;
}

async function handleCheckout(e) {
  e.preventDefault();
  
  // Simple validation
  const form = e.target;
  const formData = new FormData(form);
  
  let isValid = true;
  form.querySelectorAll('.form-input[required]').forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = '#e82127';
      isValid = false;
    } else {
      input.style.borderColor = '';
    }
  });

  if (!isValid) {
    showToast('Please fill in all required fields');
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const fees = subtotal > 0 ? 1200 : 0;
  const total = subtotal + fees;

  const orderData = {
    customerDetails: {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email').toLowerCase(), // normalize
      phone: formData.get('phone'),
      address: formData.get('address'),
      city: formData.get('city'),
      zipCode: formData.get('zip')
    },
    items: cart,
    totalAmount: total
  };

  try {
    const submitBtn = form.querySelector('.btn--primary');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    const data = await res.json();
    
    if (data.success) {
      // Clear cart
      cart = [];
      saveCart();
      window.location.href = `confirmation.html?order=${data.orderId}`;
    } else {
      showToast('Error placing order. Please try again.');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  } catch (error) {
    console.error('Error:', error);
    // Fallback if backend is not running
    // Generate order number
    const orderNumber = 'TLA' + Date.now().toString().slice(-8);
    cart = [];
    saveCart();
    window.location.href = `confirmation.html?order=${orderNumber}`;
  }
}

// ===== Confirmation Page =====
async function initConfirmationPage() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('order') || 'TLA00000000';
  
  const orderNumberEl = document.querySelector('.confirmation-order-number');
  if (orderNumberEl) {
    orderNumberEl.textContent = `Order Number: ${orderId}`;
  }

  try {
    if (orderId && orderId.startsWith('TLA') === false) {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      
      if (data.success) {
        const order = data.order;
        
        let orderDetailsHtml = `
          <div style="margin-top: 30px; text-align: left; padding: 20px; background: #f9f9f9; border-radius: 8px;">
            <h3 style="margin-bottom: 15px;">Order Details</h3>
            <p><strong>Name:</strong> ${order.customerDetails.firstName} ${order.customerDetails.lastName}</p>
            <p><strong>Email:</strong> ${order.customerDetails.email}</p>
            <p><strong>Address:</strong> ${order.customerDetails.address}, ${order.customerDetails.city}, ${order.customerDetails.zipCode}</p>
            <p><strong>Total Amount:</strong> ${formatPrice(order.totalAmount)}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <h4 style="margin-top: 15px; margin-bottom: 10px;">Items:</h4>
            <ul>
              ${order.items.map(item => `<li>${item.variant} - ${item.color} - ${formatPrice(item.price)}</li>`).join('')}
            </ul>
          </div>
        `;
        
        const insertionPoint = document.querySelector('.confirmation-text');
        if (insertionPoint) {
          insertionPoint.insertAdjacentHTML('afterend', orderDetailsHtml);
        }
      }
    }
  } catch (err) {
    console.error('Error fetching order details:', err);
  }
}

// ===== Model Pages =====
function initModelPage() {
  const modelId = document.body.dataset.model;
  if (!modelId || !MODELS[modelId]) return;

  const model = MODELS[modelId];
  
  // Update specs
  const specsContainer = document.querySelector('.model-hero__specs');
  if (specsContainer) {
    specsContainer.innerHTML = `
      <div class="spec-item">
        <div class="spec-item__value">${model.specs.range}</div>
        <div class="spec-item__label">Range (est.)</div>
      </div>
      <div class="spec-item">
        <div class="spec-item__value">${model.specs.acceleration}</div>
        <div class="spec-item__label">0-60 mph*</div>
      </div>
      <div class="spec-item">
        <div class="spec-item__value">${model.specs.topSpeed}</div>
        <div class="spec-item__label">Top Speed</div>
      </div>
      <div class="spec-item">
        <div class="spec-item__value">${model.specs.peakPower}</div>
        <div class="spec-item__label">Peak Power</div>
      </div>
    `;
  }

  // Update price
  const priceEl = document.querySelector('.model-price');
  if (priceEl) {
    priceEl.textContent = `Starting at ${formatPrice(model.basePrice)}`;
  }
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  // Always initialize navigation and cart count
  initNavigation();
  updateCartCount();

  // Page-specific initialization
  const page = document.body.dataset.page;
  
  switch (page) {
    case 'home':
      initHomepage();
      break;
    case 'model':
      initModelPage();
      break;
    case 'config':
      initConfigPage();
      break;
    case 'cart':
      initCartPage();
      break;
    case 'checkout':
      initCheckoutPage();
      break;
    case 'confirmation':
      initConfirmationPage();
      break;
    case 'login':
      initLoginPage();
      break;
    case 'account':
      initAccountPage();
      break;
    case 'admin':
      initAdminPage();
      break;
  }
});

// ===== AUTH & DASHBOARD LOGIC =====
function initLoginPage() {
  const form = document.getElementById('authForm');
  const errorEl = document.getElementById('authError');
  const switchBtn = document.getElementById('authSwitchBtn');
  const switchText = document.getElementById('authSwitchText');
  const title = document.getElementById('authTitle');
  const registerFields = document.getElementById('registerFields');
  const submitBtn = document.getElementById('authBtn');
  
  let isLogin = true;

  if (localStorage.getItem('token')) {
    window.location.href = 'account.html';
  }

  switchBtn.addEventListener('click', () => {
    isLogin = !isLogin;
    title.textContent = isLogin ? 'Sign In' : 'Create Account';
    submitBtn.textContent = isLogin ? 'Sign In' : 'Create Account';
    switchText.textContent = isLogin ? "Don't have an account?" : 'Already have an account?';
    switchBtn.textContent = isLogin ? 'Create account' : 'Sign In';
    registerFields.style.display = isLogin ? 'none' : 'block';
    errorEl.style.display = 'none';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.toLowerCase();
    const password = document.getElementById('password').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin ? { email, password } : { email, password, firstName, lastName };

    submitBtn.textContent = 'Processing...';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = 'account.html';
      } else {
        errorEl.textContent = data.message;
        errorEl.style.display = 'block';
        submitBtn.textContent = isLogin ? 'Sign In' : 'Create Account';
      }
    } catch (err) {
      errorEl.textContent = 'Network error. Make sure server is running.';
      errorEl.style.display = 'block';
      submitBtn.textContent = isLogin ? 'Sign In' : 'Create Account';
    }
  });
}

async function initAccountPage() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  });

  try {
    const res = await fetch(`/api/users/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();

    if (!data.success) {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
      return;
    }

    const { user, orders } = data;
    document.getElementById('userNameDisplay').textContent = `Hi, ${user.firstName || 'Driver'}`;
    
    const container = document.getElementById('ordersContainer');
    
    if (orders.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>No cars in your garage yet</h3>
          <p>Once you place an order, you can track it here.</p>
          <a href="index.html" class="btn btn--primary" style="margin-top:20px; display:inline-block;">Explore Vehicles</a>
        </div>
      `;
      return;
    }

    container.innerHTML = orders.map(order => {
      // Basic logic to determine tracking bar fill based on static 'Confirmed', 'Building', 'Delivered'
      // Since it's an immediate clone, we assume Confirmed is the default status
      const status = order.status || 'Confirmed';
      let progressWidth = '25%';
      let step1='step-active', step2='', step3='', step4='';
      
      if (status === 'Confirmed') {
        progressWidth = '25%'; step2='step-active'; 
      } else if (status === 'In Production') {
        progressWidth = '50%'; step2='step-active'; step3='step-active';
      } else if (status === 'In Transit') {
        progressWidth = '75%'; step2='step-active'; step3='step-active'; step4='step-active';
      } else if (status === 'Delivered') {
        progressWidth = '100%'; step2='step-active'; step3='step-active'; step4='step-active';
      }

      return `
        <div class="order-card">
          <div class="order-header">
            <div>
              Order Date: <strong>${new Date(order.orderDate).toLocaleDateString()}</strong>
            </div>
            <div>
              Order #: <strong>${order._id.substring(0, 8).toUpperCase()}</strong>
            </div>
            <div>
              Total: <strong>${formatPrice(order.totalAmount)}</strong>
            </div>
          </div>
          
          <h4 style="margin-bottom: 5px;">Delivery Tracker</h4>
          <span style="font-size: 13px; color: #5c5e62; display:block; margin-bottom: 20px;">Current Status: <span style="color:#171a20; font-weight:500;">${status}</span></span>
          
          <div class="tracker-container">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progressWidth};"></div>
              
              <div class="progress-step ${step1}">
                <div class="step-circle"></div>
                <div class="step-text">Order Placed</div>
              </div>
              <div class="progress-step ${step2}">
                <div class="step-circle"></div>
                <div class="step-text">Payment Confirmed</div>
              </div>
              <div class="progress-step ${step3}">
                <div class="step-circle"></div>
                <div class="step-text">In Production</div>
              </div>
              <div class="progress-step ${step4}">
                <div class="step-circle"></div>
                <div class="step-text">Delivered</div>
              </div>
            </div>
          </div>
          
          <div class="order-items">
            ${order.items.map(item => `
              <div style="flex:1; border-right: 1px solid #eee; padding-right:15px; min-width: 150px;">
                <p style="font-weight:500; font-size: 15px; margin-bottom:5px;">${item.variant}</p>
                <p style="font-size: 13px; color:#5c5e62;">${item.color}</p>
                <p style="font-size: 13px; color:#5c5e62;">${item.wheels}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    document.getElementById('ordersContainer').innerHTML = `<p style="color:red;">Error loading dashboard.</p>`;
  }
}

// ===== ADMIN PANEL LOGIC =====
async function initAdminPage() {
  const token = localStorage.getItem('token');
  let user = null;
  try { user = JSON.parse(localStorage.getItem('user')); } catch (e) {}

  if (!token || !user || !user.isAdmin) {
    window.location.href = 'index.html';
    return;
  }

  try {
    const res = await fetch(`/api/admin/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();

    if (!data.success) {
      alert('Failed to load admin data');
      return;
    }

    // Update Stats
    document.getElementById('statRevenue').textContent = formatPrice(data.totalRevenue);
    document.getElementById('statOrders').textContent = data.orders.length;
    document.getElementById('statUsers').textContent = data.usersCount;

    // Render Table
    const tbody = document.getElementById('adminOrdersTable');
    if (data.orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No orders in the system yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = data.orders.map(order => {
      const oDate = new Date(order.orderDate).toLocaleDateString();
      const oId = order._id.substring(0,8).toUpperCase();
      const statusClass = (order.status || 'Confirmed').toLowerCase().replace(' ', '-');
      const itemsList = order.items.map(i => i.variant).join(', ');

      return `
        <tr>
          <td><strong>${oId}</strong></td>
          <td>${oDate}</td>
          <td>
            ${order.customerDetails.firstName} ${order.customerDetails.lastName}<br>
            <small style="color:#5c5e62">${order.customerDetails.email}</small>
          </td>
          <td>${itemsList}</td>
          <td><strong>${formatPrice(order.totalAmount)}</strong></td>
          <td>
            <span class="pill ${statusClass}" id="pill-${order._id}">${order.status || 'Confirmed'}</span>
          </td>
          <td>
            <select class="status-select" id="select-${order._id}" style="margin-right:8px;">
              <option value="Confirmed" ${(order.status==='Confirmed')?'selected':''}>Confirmed</option>
              <option value="In Production" ${(order.status==='In Production')?'selected':''}>In Production</option>
              <option value="In Transit" ${(order.status==='In Transit')?'selected':''}>In Transit</option>
              <option value="Delivered" ${(order.status==='Delivered')?'selected':''}>Delivered</option>
            </select>
            <button class="btn-update" onclick="updateOrderStatus('${order._id}')">Update</button>
          </td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    console.error(err);
    document.getElementById('adminOrdersTable').innerHTML = `<tr><td colspan="7" style="color:red;">Error loading orders</td></tr>`;
  }
}

window.updateOrderStatus = async function(orderId) {
  const select = document.getElementById(`select-${orderId}`);
  const newStatus = select.value;
  const token = localStorage.getItem('token');
  
  if (!token) return;

  try {
    const res = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });
    
    const data = await res.json();
    if (data.success) {
      showToast('Order status updated!');
      const pill = document.getElementById(`pill-${orderId}`);
      pill.textContent = newStatus;
      pill.className = `pill ${newStatus.toLowerCase().replace(' ', '-')}`;
    } else {
      showToast('Failed to update status');
    }
  } catch(err) {
    showToast('Network error');
  }
};
