// === CONFIGURACIÓN DE LA TIENDA ===
const STORE_CONFIG = {
    // --- CONFIGURACIÓN DE LA TIENDA ---
    GOOGLE_SHEET_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRfIzj8mShCFdiCE2HJ_cFDgzuYrssOwTGYPUCRuWDSudt-z34lMha21Y0ou3gf1N6SKTR34JRLjKJU/pub?gid=675350694&single=true&output=csv', // URL que SÍ funciona
    WHATSAPP_NUMBER: '573007148250', // Número principal - Incluir código de país
    DELIVERY_COST: 5000, // Costo de domicilio en número
    STORE_NAME: 'TE LO VENDO RIOHACHA',
    GOOGLE_MAPS_URL: 'https://maps.app.goo.gl/iDLS8qAVYFDYNmWw6', // URL de la ubicación

    // Comentario: Horario comercial - Lunes a Sábado de 9am a 6pm
    businessHours: {
        monday: { open: 9, close: 20 },
        tuesday: { open: 9, close: 20 },
        wednesday: { open: 9, close: 20 },
        thursday: { open: 9, close: 20 },
        friday: { open: 9, close: 20 },
        saturday: { open: 9, close: 20 },
        sunday: { open: 9, close: 13 }
    }
};

// Comentario: Productos de respaldo solo para casos de emergencia
const FALLBACK_PRODUCTS = [];

// === VARIABLES GLOBALES ===
let allProducts = [];
let filteredProducts = [];
let currentCategory = 'all';
let cart = [];
let isCheckoutOpen = false;

// === CLASES PRINCIPALES ===

/**
 * Comentario: Clase para gestionar productos y conexión con Google Sheets
 */
class ProductManager {
    constructor() {
        this.products = [];
        this.isLoading = false;
    }

    /**
     * Comentario: Cargar productos desde Google Sheets
     */
    async loadProducts() {
        this.isLoading = true;
        this.showLoadingState();

        try {
            // Comentario: Intentar cargar desde Google Sheets
            if (STORE_CONFIG.GOOGLE_SHEET_URL && STORE_CONFIG.GOOGLE_SHEET_URL !== 'URL_PUBLICA_DE_LA_HOJA_CSV_AQUI') {
                console.log('Cargando productos desde Google Sheets:', STORE_CONFIG.GOOGLE_SHEET_URL);

                const response = await fetch(STORE_CONFIG.GOOGLE_SHEET_URL);

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
                }

                const csvText = await response.text();
                console.log('CSV recibido, primeras 200 caracteres:', csvText.substring(0, 200));

                this.products = this.parseCSV(csvText);
                console.log('Productos parseados:', this.products.length);

                if (this.products.length === 0) {
                    throw new Error('No se encontraron productos en Google Sheets');
                }
            } else {
                // Comentario: Sin URL configurada, mostrar mensaje de error
                throw new Error('Google Sheets URL no configurada. Configure GOOGLE_SHEET_URL en STORE_CONFIG.');
            }

            // Comentario: Filtrar solo productos visibles
            this.products = this.products.filter(product =>
                product.Visible && product.Visible.toUpperCase() === 'SI'
            );

            allProducts = this.products;
            filteredProducts = this.products;

            this.renderProducts();
            this.updateCategoryFilters();

        } catch (error) {
            console.error('❌ Error cargando productos desde Google Sheets:', error);

            // Comentario: Mostrar mensaje de error específico al usuario
            const errorMessage = this.getErrorMessage(error);
            console.warn('🔄 Usando productos de ejemplo debido a error:', errorMessage);

            // Comentario: Mostrar notificación al usuario
            this.showErrorNotification(errorMessage);

            // Comentario: Solo usar productos de respaldo si están disponibles
            this.products = FALLBACK_PRODUCTS;
            allProducts = this.products;
            filteredProducts = this.products;
            this.renderProducts();
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Comentario: Parsear CSV de Google Sheets
     */
    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');

        if (lines.length < 2) {
            console.error('CSV no tiene suficientes líneas');
            return [];
        }

        // Comentario: Limpiar headers y remover comillas
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        console.log('Headers encontrados:', headers);

        const products = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue; // Saltar líneas vacías

            // Comentario: Parsear CSV considerando comillas
            const values = this.parseCSVLine(line);
            const product = {};

            headers.forEach((header, index) => {
                const value = values[index] ? values[index].trim().replace(/"/g, '') : '';
                product[header] = value;
            });

            // Comentario: Convertir precios a números
            if (product.PrecioOriginal && product.PrecioOriginal !== '') {
                product.PrecioOriginal = parseInt(product.PrecioOriginal.replace(/[^\d]/g, '')) || null;
            } else {
                product.PrecioOriginal = null;
            }

            if (product.PrecioFinal) {
                product.PrecioFinal = parseInt(product.PrecioFinal.replace(/[^\d]/g, '')) || 0;
            }

            if (product.ID) {
                product.ID = parseInt(product.ID) || 0;
            }

            // Comentario: Solo agregar productos válidos
            if (product.ID && product.NombreProducto && product.PrecioFinal > 0) {
                products.push(product);
            }
        }

        console.log('Productos válidos parseados:', products.length);
        return products;
    }

    /**
     * Comentario: Parsear una línea CSV considerando comillas
     */
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current);
        return result;
    }

    /**
     * Comentario: Obtener mensaje de error específico
     */
    getErrorMessage(error) {
        if (error.message.includes('403')) {
            return 'La hoja de Google Sheets no es pública. Cambia los permisos a "Cualquier persona con el enlace puede ver".';
        } else if (error.message.includes('404')) {
            return 'La hoja de Google Sheets no existe o el ID es incorrecto.';
        } else if (error.message.includes('CORS')) {
            return 'Problema de permisos CORS. Verifica que la hoja sea pública.';
        } else if (error.message.includes('Failed to fetch')) {
            return 'No se puede conectar a Google Sheets. Verifica tu conexión a internet y que la hoja sea pública.';
        } else {
            return `Error: ${error.message}`;
        }
    }

    /**
     * Comentario: Mostrar notificación de error al usuario
     */
    showErrorNotification(message) {
        // Comentario: Crear notificación de error
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            right: 20px;
            background: #ff6b6b;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1001;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
            font-size: 14px;
            line-height: 1.4;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 10px;">
                <div style="font-size: 18px;">⚠️</div>
                <div style="flex: 1;">
                    <strong>Problema con Google Sheets</strong><br>
                    ${message}<br>
                    <small>Mostrando productos de ejemplo mientras tanto.</small>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: none;
                    border: none;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 0;
                    margin-left: 10px;
                ">×</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Comentario: Auto-remover después de 10 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }

    /**
     * Comentario: Mostrar estado de carga
     */
    showLoadingState() {
        const loadingElement = document.getElementById('loadingState');
        const gridElement = document.getElementById('productsGrid');
        const emptyElement = document.getElementById('emptyState');

        if (loadingElement) loadingElement.classList.remove('hidden');
        if (gridElement) gridElement.classList.add('hidden');
        if (emptyElement) emptyElement.classList.add('hidden');
    }

    /**
     * Comentario: Mostrar estado vacío
     */
    showEmptyState() {
        const loadingElement = document.getElementById('loadingState');
        const gridElement = document.getElementById('productsGrid');
        const emptyElement = document.getElementById('emptyState');

        if (loadingElement) loadingElement.classList.add('hidden');
        if (gridElement) gridElement.classList.add('hidden');
        if (emptyElement) emptyElement.classList.remove('hidden');
    }

    /**
     * Comentario: Renderizar productos en el grid
     */
    renderProducts() {
        const gridElement = document.getElementById('productsGrid');
        const loadingElement = document.getElementById('loadingState');
        const emptyElement = document.getElementById('emptyState');

        if (!gridElement) return;

        // Comentario: Ocultar estados de carga y vacío
        if (loadingElement) loadingElement.classList.add('hidden');
        if (emptyElement) emptyElement.classList.add('hidden');

        if (filteredProducts.length === 0) {
            this.showEmptyState();
            return;
        }

        // Comentario: Mostrar grid y renderizar productos
        gridElement.classList.remove('hidden');
        gridElement.innerHTML = filteredProducts.map(product => this.createProductCard(product)).join('');
    }

    /**
     * Comentario: Crear tarjeta HTML para un producto
     */
    createProductCard(product) {
        const hasDiscount = product.PrecioOriginal && product.PrecioOriginal > product.PrecioFinal;
        const discountPercent = hasDiscount ?
            Math.round(((product.PrecioOriginal - product.PrecioFinal) / product.PrecioOriginal) * 100) : 0;

        // Comentario: Obtener solo la primera imagen si hay múltiples URLs separadas por comas
        let displayImage = product.URL_Imagen;
        if (displayImage && displayImage.includes(',')) {
            displayImage = displayImage.split(',')[0].trim();
        }

        // Comentario: Calcular ahorro si hay descuento
        const savings = hasDiscount ? product.PrecioOriginal - product.PrecioFinal : 0;

        // Comentario: Generar estrellas de calificación (4-5 estrellas aleatorias)
        const rating = 4 + Math.random();
        const fullStars = Math.floor(rating);
        const reviewCount = Math.floor(Math.random() * 150) + 20; // Entre 20 y 170 reseñas

        // Comentario: Truncar descripción a 80 caracteres para mantener uniformidad
        const maxDescriptionLength = 80;
        let truncatedDescription = product.Descripcion || '';
        if (truncatedDescription.length > maxDescriptionLength) {
            truncatedDescription = truncatedDescription.substring(0, maxDescriptionLength).trim() + '...';
        }

        return `
            <div class="product-card" data-product-id="${product.ID}" onclick="openProductModal(${product.ID})" style="cursor: pointer;">
                <!-- Badge de oferta/popularidad -->
                ${discountPercent >= 20 ? '<div class="badge badge-bestseller">🔥 Oferta</div>' : ''}

                <!-- Badge de envío -->
                <div class="shipping-badge">🚚 Envío disponible</div>

                <div class="product-image">
                    ${displayImage.startsWith('http') ?
                        `<img src="${displayImage}" alt="${product.NombreProducto}">` :
                        `<span class="product-emoji">${displayImage}</span>`
                    }
                    ${hasDiscount ? `<div class="product-badge">-${discountPercent}%</div>` : ''}
                </div>
                <div class="product-info">
                    <!-- Sistema de calificación -->
                    <div class="rating">
                        <span class="stars">${'⭐'.repeat(fullStars)}</span>
                        <span class="reviews-count">(${reviewCount})</span>
                    </div>

                    <h3 class="product-name">${product.NombreProducto}</h3>
                    <p class="product-description">${truncatedDescription}</p>

                    <div class="product-pricing">
                        <div class="price-container">
                            <span class="current-price">$${product.PrecioFinal.toLocaleString()}</span>
                            ${hasDiscount ? `<span class="original-price">$${product.PrecioOriginal.toLocaleString()}</span>` : ''}
                        </div>
                        ${hasDiscount ? `<div class="savings-amount">Ahorras: $${savings.toLocaleString()}</div>` : ''}
                    </div>

                    <!-- Información logística -->
                    <p class="delivery-info">📦 Entrega inmediata en Riohacha</p>

                    <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.ID})">
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Comentario: Actualizar filtros de categorías basado en productos disponibles
     */
    updateCategoryFilters() {
        const categories = [...new Set(this.products.map(p => p.Categoria))];
        const categoryContainer = document.querySelector('.categories-container');

        if (!categoryContainer) return;

        // Comentario: Mantener botón "Todos" y agregar categorías dinámicamente
        const allButton = categoryContainer.querySelector('[data-category="all"]');
        categoryContainer.innerHTML = '';

        if (allButton) {
            categoryContainer.appendChild(allButton);
        }

        categories.forEach(category => {
            if (category && category.trim()) {
                const button = document.createElement('button');
                button.className = 'category-filter';
                button.setAttribute('data-category', category);
                button.onclick = () => filterByCategory(category);
                button.textContent = category;
                categoryContainer.appendChild(button);
            }
        });
    }
}

/**
 * Comentario: Clase para gestionar el carrito de compras
 */
class CartManager {
    constructor() {
        this.cart = this.loadCartFromStorage();
        this.updateCartDisplay();
    }

    /**
     * Comentario: Cargar carrito desde localStorage
     */
    loadCartFromStorage() {
        try {
            const saved = localStorage.getItem('telovendo_cart');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error cargando carrito:', error);
            return [];
        }
    }

    /**
     * Comentario: Guardar carrito en localStorage
     */
    saveCartToStorage() {
        try {
            localStorage.setItem('telovendo_cart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error guardando carrito:', error);
        }
    }

    /**
     * Comentario: Agregar producto al carrito
     */
    addToCart(productId, sourceElement = null) {
        const product = allProducts.find(p => p.ID === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                productId: productId,
                product: product,
                quantity: 1
            });
        }

        this.saveCartToStorage();
        this.updateCartDisplay();
        this.showAddedNotification(product.NombreProducto);

        // Comentario: Animación del botón si se proporciona elemento fuente
        if (sourceElement) {
            this.animateAddToCart(sourceElement);
        }

        // Comentario: Animación del carrito flotante
        const cartFloat = document.getElementById('cartFloat');
        if (cartFloat) {
            cartFloat.classList.add('pulse');
            setTimeout(() => cartFloat.classList.remove('pulse'), 500);
        }

        // Comentario: Track del evento
        trackEvent('add_to_cart', { productId, productName: product.NombreProducto });
    }

    /**
     * Comentario: Animar botón de agregar al carrito
     */
    animateAddToCart(button) {
        const originalText = button.textContent;

        button.classList.add('success');
        button.textContent = '✓ Agregado';
        button.disabled = true;

        setTimeout(() => {
            button.classList.remove('success');
            button.textContent = originalText;
            button.disabled = false;
        }, 2000);
    }

    /**
     * Comentario: Remover producto del carrito
     */
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.productId !== productId);
        this.saveCartToStorage();
        this.updateCartDisplay();

        // Comentario: Si el carrito queda vacío y el checkout está abierto, cerrarlo
        if (this.cart.length === 0 && isCheckoutOpen) {
            checkoutManager.closeModal();
        }

        // Comentario: Si el checkout está abierto, re-renderizar
        if (isCheckoutOpen && checkoutManager) {
            checkoutManager.renderOrderSummary();
        }
    }

    /**
     * Comentario: Actualizar cantidad de un producto
     */
    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        const item = this.cart.find(item => item.productId === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCartToStorage();
            this.updateCartDisplay();

            // Comentario: Si el checkout está abierto, re-renderizar
            if (isCheckoutOpen && checkoutManager) {
                checkoutManager.renderOrderSummary();
            }
        }
    }

    /**
     * Comentario: Obtener total del carrito
     */
    getCartTotal() {
        return this.cart.reduce((total, item) => {
            // Comentario: Verificar que el producto y su precio son válidos
            if (item && item.product && typeof item.product.PrecioFinal === 'number') {
                return total + (item.product.PrecioFinal * item.quantity);
            }
            return total; // Si no es válido, no sumar nada y continuar
        }, 0);
    }

    /**
     * Comentario: Obtener cantidad total de items
     */
    getCartItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    /**
     * Comentario: Actualizar display del carrito flotante
     */
    updateCartDisplay() {
        const cartFloat = document.getElementById('cartFloat');
        const cartCount = document.getElementById('cartCount');
        const cartTotal = document.getElementById('cartTotal');
        const whatsappFloat = document.querySelector('.whatsapp-float');

        if (!cartFloat || !cartCount || !cartTotal) return;

        const itemCount = this.getCartItemCount();
        const total = this.getCartTotal();

        if (itemCount === 0) {
            cartFloat.classList.add('hidden');
            if (whatsappFloat) {
                whatsappFloat.classList.remove('cart-visible');
            }
        } else {
            cartFloat.classList.remove('hidden');
            if (whatsappFloat) {
                whatsappFloat.classList.add('cart-visible');
            }
            cartCount.textContent = `${itemCount} producto${itemCount !== 1 ? 's' : ''}`;
            cartTotal.textContent = `$${total.toLocaleString()}`;
        }
    }

    /**
     * Comentario: Mostrar notificación de producto agregado
     */
    showAddedNotification(productName) {
        // Comentario: Crear notificación temporal
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1001;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = `${productName} agregado al carrito`;
        document.body.appendChild(notification);

        // Comentario: Animar entrada y salida
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        setTimeout(() => notification.style.transform = 'translateX(100%)', 2000);
        setTimeout(() => document.body.removeChild(notification), 2300);
    }

    /**
     * Comentario: Limpiar carrito
     */
    clearCart() {
        this.cart = [];
        this.saveCartToStorage();
        this.updateCartDisplay();
    }
}

/**
 * Comentario: Clase para gestionar el proceso de checkout
 */
class CheckoutManager {
    constructor() {
        this.deliveryType = 'pickup';
        this.customerData = {};
    }

    /**
     * Comentario: Iniciar proceso de checkout
     */
    startCheckout() {
        if (cartManager.cart.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }

        isCheckoutOpen = true;
        this.renderOrderSummary();
        this.updateCheckoutForSchedule();
        this.showModal();

        // Comentario: Track del evento
        trackEvent('checkout_started', { itemCount: cartManager.getCartItemCount() });
    }

    /**
     * Comentario: Actualizar checkout para pedido programado
     */
    updateCheckoutForSchedule() {
        const now = new Date();
        const colombiaTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Bogota"}));
        const hour = colombiaTime.getHours();

        const checkoutButton = document.querySelector('.btn-primary[onclick="confirmOrder()"]');

        if (hour < 9 || hour >= 20) {
            // Fuera de horario - mostrar mensaje informativo si existe
            window.isScheduledOrder = true;
            if (checkoutButton) {
                checkoutButton.textContent = 'Programar Mi Pedido';
            }
        } else {
            // Dentro de horario
            window.isScheduledOrder = false;
            if (checkoutButton) {
                checkoutButton.textContent = 'Confirmar Pedido';
            }
        }
    }

    /**
     * Comentario: Mostrar modal de checkout
     */
    showModal() {
        const modal = document.getElementById('checkoutModal');
        if (modal) {
            modal.classList.remove('hidden');
            // Comentario: Prevenir scroll del body
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Comentario: Cerrar modal de checkout
     */
    closeModal() {
        const modal = document.getElementById('checkoutModal');
        if (modal) {
            modal.classList.add('hidden');
            // Comentario: Restaurar scroll del body
            document.body.style.overflow = '';
        }
        isCheckoutOpen = false;
    }

    /**
     * Comentario: Renderizar resumen del pedido
     */
    renderOrderSummary() {
        const orderItems = document.getElementById('orderItems');
        const subtotalAmount = document.getElementById('subtotalAmount');
        const totalAmount = document.getElementById('totalAmount');

        if (!orderItems) return;

        // Comentario: Renderizar items del pedido con controles de cantidad y botón eliminar
        orderItems.innerHTML = cartManager.cart.map(item => `
            <div class="order-item">
                <div class="item-info">
                    <div class="item-name">${item.product.NombreProducto}</div>
                    <div class="item-quantity-control">
                        <button class="quantity-btn-small" onclick="decreaseCartItemQuantity(${item.productId})" aria-label="Disminuir cantidad">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 7H11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="quantity-btn-small" onclick="increaseCartItemQuantity(${item.productId})" aria-label="Aumentar cantidad">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 3V11M3 7H11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </div>
                    <div class="item-details">$${item.product.PrecioFinal.toLocaleString()} c/u</div>
                </div>
                <div class="item-actions">
                    <div class="item-price">$${(item.product.PrecioFinal * item.quantity).toLocaleString()}</div>
                    <button class="remove-item-btn" onclick="removeCartItem(${item.productId})" aria-label="Eliminar producto">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');

        // Comentario: Actualizar totales
        this.updateTotals();
    }

    /**
     * Comentario: Actualizar totales del pedido
     */
    updateTotals() {
        const subtotal = cartManager.getCartTotal();
        const deliveryCost = this.deliveryType === 'delivery' ? STORE_CONFIG.DELIVERY_COST : 0;
        const total = subtotal + deliveryCost;

        const subtotalElement = document.getElementById('subtotalAmount');
        const totalElement = document.getElementById('totalAmount');
        const deliveryCostRow = document.getElementById('deliveryCostRow');

        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toLocaleString()}`;
        if (totalElement) totalElement.textContent = `$${total.toLocaleString()}`;

        // Comentario: Mostrar/ocultar costo de domicilio
        if (deliveryCostRow) {
            if (this.deliveryType === 'delivery') {
                deliveryCostRow.classList.remove('hidden');
            } else {
                deliveryCostRow.classList.add('hidden');
            }
        }
    }

    /**
     * Comentario: Cambiar tipo de entrega
     */
    toggleDeliveryType() {
        const deliveryRadio = document.querySelector('input[name="deliveryType"]:checked');
        if (deliveryRadio) {
            this.deliveryType = deliveryRadio.value;
            this.updateTotals();

            // Comentario: Mostrar/ocultar campos de dirección
            const deliveryFields = document.getElementById('deliveryFields');
            if (deliveryFields) {
                if (this.deliveryType === 'delivery') {
                    deliveryFields.classList.remove('hidden');
                    // Comentario: Hacer campo de dirección requerido
                    const addressField = document.getElementById('customerAddress');
                    if (addressField) addressField.required = true;
                } else {
                    deliveryFields.classList.add('hidden');
                    // Comentario: Remover requerimiento de dirección
                    const addressField = document.getElementById('customerAddress');
                    if (addressField) {
                        addressField.required = false;
                        addressField.value = '';
                    }
                }
            }
        }
    }

    /**
     * Comentario: Validar datos del formulario
     */
    validateForm() {
        const name = document.getElementById('customerName')?.value.trim();
        const phone = document.getElementById('customerPhone')?.value.trim();
        const address = document.getElementById('customerAddress')?.value.trim();

        if (!name) {
            alert('Por favor ingresa tu nombre completo');
            return false;
        }

        if (!phone) {
            alert('Por favor ingresa tu número de teléfono');
            return false;
        }

        if (this.deliveryType === 'delivery' && !address) {
            alert('Por favor ingresa tu dirección para el domicilio');
            return false;
        }

        return true;
    }

    /**
     * Comentario: Confirmar pedido y enviar a WhatsApp
     */
    confirmOrder() {
        if (!this.validateForm()) return;

        // Comentario: Recopilar datos del cliente
        this.customerData = {
            name: document.getElementById('customerName')?.value.trim(),
            phone: document.getElementById('customerPhone')?.value.trim(),
            address: document.getElementById('customerAddress')?.value.trim(),
            notes: document.getElementById('customerNotes')?.value.trim(),
            deliveryType: this.deliveryType
        };

        // Comentario: Generar mensaje para WhatsApp
        const message = this.generateWhatsAppMessage();

        // Comentario: Enviar a WhatsApp
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${STORE_CONFIG.WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        // Comentario: Track del evento
        trackEvent('order_confirmed', {
            itemCount: cartManager.getCartItemCount(),
            totalValue: cartManager.getCartTotal() + (this.deliveryType === 'delivery' ? STORE_CONFIG.DELIVERY_COST : 0),
            deliveryType: this.deliveryType
        });

        // Comentario: Limpiar carrito y cerrar modal
        cartManager.clearCart();
        this.closeModal();

        // Comentario: Mostrar confirmación
        alert('¡Pedido enviado! Te contactaremos pronto por WhatsApp.');
    }

    /**
     * Comentario: Generar mensaje estructurado para WhatsApp
     */
    generateWhatsAppMessage() {
        const subtotal = cartManager.getCartTotal();
        const deliveryCost = this.deliveryType === 'delivery' ? STORE_CONFIG.DELIVERY_COST : 0;
        const total = subtotal + deliveryCost;

        let message = `🛒 *NUEVO PEDIDO - ${STORE_CONFIG.STORE_NAME}*\n\n`;

        // Comentario: Tipo de pedido
        if (window.isScheduledOrder) {
            message += `⏰ *PEDIDO PROGRAMADO*\n`;
            message += `📅 Para entrega mañana a partir de las 9:00 AM\n\n`;
        } else {
            message += `✅ *PEDIDO INMEDIATO*\n\n`;
        }

        // Comentario: Datos del cliente
        message += `👤 *Cliente:*\n`;
        message += `Nombre: ${this.customerData.name}\n`;
        message += `Teléfono: ${this.customerData.phone}\n`;

        // Comentario: Tipo de entrega
        message += `\n🚚 *Entrega:*\n`;
        if (this.deliveryType === 'pickup') {
            message += `📍 Recoger en local\n`;
        } else {
            message += `🏠 Domicilio\n`;
            message += `Dirección: ${this.customerData.address}\n`;
        }

        // Comentario: Items del pedido
        message += `\n📦 *Productos:*\n`;
        cartManager.cart.forEach((item, index) => {
            message += `${index + 1}. ${item.product.NombreProducto}\n`;
            message += `   Cantidad: ${item.quantity}\n`;
            message += `   Precio: $${item.product.PrecioFinal.toLocaleString()} c/u\n`;
            message += `   Subtotal: $${(item.product.PrecioFinal * item.quantity).toLocaleString()}\n\n`;
        });

        // Comentario: Totales
        message += `💰 *Resumen:*\n`;
        message += `Subtotal: $${subtotal.toLocaleString()}\n`;
        if (deliveryCost > 0) {
            message += `Domicilio: $${deliveryCost.toLocaleString()}\n`;
        }
        message += `*Total: $${total.toLocaleString()}*\n`;

        // Comentario: Notas adicionales
        if (this.customerData.notes) {
            message += `\n📝 *Notas:*\n${this.customerData.notes}\n`;
        }

        message += `\n📅 Pedido realizado: ${new Date().toLocaleString('es-CO', {timeZone: 'America/Bogota'})}\n`;

        return message;
    }
}

// === FUNCIONES GLOBALES ===

/**
 * Comentario: Instancias globales de los managers
 */
let productManager;
let cartManager;
let checkoutManager;

/**
 * Comentario: Función para volver al inicio
 */
function goHome() {
    // Comentario: Animación suave de transición
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '0';

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 300);
}

/**
 * Comentario: Función para abrir WhatsApp
 */
function openWhatsApp() {
    const message = encodeURIComponent(
        `¡Hola! Me interesa conocer más sobre los productos de ${STORE_CONFIG.STORE_NAME}. ¿Podrían ayudarme?`
    );

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${STORE_CONFIG.WHATSAPP_NUMBER}&text=${message}`;
    window.open(whatsappUrl, '_blank');

    trackEvent('whatsapp_click_menu');
}

/**
 * Comentario: Agregar producto al carrito
 */
function addToCart(productId) {
    cartManager.addToCart(productId);
}

/**
 * Comentario: Filtrar productos por categoría
 */
function filterByCategory(category) {
    currentCategory = category;

    // Comentario: Actualizar botones de filtro
    document.querySelectorAll('.category-filter').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        }
    });

    // Comentario: Filtrar productos
    if (category === 'all') {
        filteredProducts = allProducts;
    } else {
        filteredProducts = allProducts.filter(product => product.Categoria === category);
    }

    productManager.renderProducts();
    trackEvent('category_filter', { category });
}

/**
 * Comentario: Realizar búsqueda de productos
 */
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const query = searchInput.value.trim().toLowerCase();

    if (query.length === 0) {
        // Comentario: Restaurar filtro actual si no hay búsqueda
        filterByCategory(currentCategory);
        return;
    }

    // Comentario: Buscar en nombre y descripción
    filteredProducts = allProducts.filter(product => {
        return product.NombreProducto.toLowerCase().includes(query) ||
               product.Descripcion.toLowerCase().includes(query);
    });

    productManager.renderProducts();
    trackEvent('product_search', { query, resultsCount: filteredProducts.length });
}

/**
 * Comentario: Limpiar búsqueda y mostrar todos los productos
 */
function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    filterByCategory('all');
}

/**
 * Comentario: Iniciar proceso de checkout
 */
function startCheckout() {
    checkoutManager.startCheckout();
}

/**
 * Comentario: Cerrar modal de checkout
 */
function closeCheckout() {
    checkoutManager.closeModal();
}

/**
 * Comentario: Cambiar tipo de entrega
 */
function toggleDeliveryType() {
    checkoutManager.toggleDeliveryType();
}

/**
 * Comentario: Confirmar pedido
 */
function confirmOrder() {
    checkoutManager.confirmOrder();
}

/**
 * Comentario: Actualizar estado de la tienda
 */
function updateStoreStatus() {
    // Comentario: Reutilizar lógica del script de inicio
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hour = now.getHours();

    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = dayNames[dayOfWeek];
    const todayHours = STORE_CONFIG.businessHours[currentDay];

    const isOpen = todayHours.open && hour >= todayHours.open && hour < todayHours.close;

    const statusElement = document.getElementById('store-status-menu');
    const indicatorElement = document.getElementById('status-indicator-menu');

    if (statusElement && indicatorElement) {
        // Comentario: Usar mensajes positivos que no generen fricción
        statusElement.textContent = isOpen ? 'Abierto ahora' : 'Pedidos 24/7';

        if (isOpen) {
            indicatorElement.classList.remove('closed');
        } else {
            indicatorElement.classList.add('closed');
        }
    }
}

/**
 * Comentario: Sistema de analíticas
 */
function trackEvent(eventName, data = {}) {
    try {
        const eventData = {
            event: eventName,
            timestamp: new Date().toISOString(),
            page: 'menu',
            userAgent: navigator.userAgent,
            ...data
        };

        const events = JSON.parse(localStorage.getItem('store_analytics') || '[]');
        events.push(eventData);

        if (events.length > 100) {
            events.splice(0, events.length - 100);
        }

        localStorage.setItem('store_analytics', JSON.stringify(events));
    } catch (error) {
        console.error('Error tracking event:', error);
    }
}

/**
 * Comentario: Configurar búsqueda en tiempo real
 */
function setupLiveSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    let searchTimeout;

    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);

        // Comentario: Debounce para evitar búsquedas excesivas
        searchTimeout = setTimeout(() => {
            performSearch();
        }, 300);
    });

    // Comentario: Buscar al presionar Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            clearTimeout(searchTimeout);
            performSearch();
        }
    });
}

/**
 * Comentario: Configurar atajos de teclado
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Comentario: Evitar atajos cuando se está escribiendo
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        switch (e.key.toLowerCase()) {
            case 'h':
                goHome();
                break;
            case 'w':
                openWhatsApp();
                break;
            case 'c':
                if (cartManager.getCartItemCount() > 0) {
                    startCheckout();
                }
                break;
            case 'escape':
                if (isCheckoutOpen) {
                    closeCheckout();
                }
                break;
        }
    });
}

/**
 * Comentario: Cerrar modal al hacer clic fuera
 */
function setupModalEvents() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay') && isCheckoutOpen) {
            closeCheckout();
        }
    });
}

/**
 * Comentario: Actualizar banner de horarios según hora de Colombia
 */
function updateScheduleBanner() {
    const now = new Date();
    const colombiaTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Bogota"}));
    const hour = colombiaTime.getHours();

    const banner = document.getElementById('scheduleBanner');
    const icon = document.getElementById('bannerIcon');
    const text = document.getElementById('bannerText');

    if (!banner || !icon || !text) return;

    if (hour >= 9 && hour < 20) {
        // Horario abierto
        banner.classList.remove('after-hours');
        icon.textContent = '🌟';
        text.textContent = '¡Estamos abiertos! Pide ahora y recibe tu pedido hoy mismo.';
    } else {
        // Fuera de horario
        banner.classList.add('after-hours');
        icon.textContent = '🌙';
        text.textContent = 'Estás comprando fuera de nuestro horario. Finaliza tu pedido ahora y serás el primero en la fila para la entrega de mañana.';
    }
}

/**
 * Comentario: Inicializar tema desde localStorage
 */
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');

    if (!themeToggle) return;

    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        themeToggle.textContent = '🌙';
    } else {
        themeToggle.textContent = '☀️';
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');

        themeToggle.textContent = isLight ? '🌙' : '☀️';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');

        // Animación de transición
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => themeToggle.style.transform = 'rotate(0deg)', 300);

        trackEvent('theme_toggle', { theme: isLight ? 'light' : 'dark' });
    });
}

// === INICIALIZACIÓN ===

/**
 * Comentario: Inicializar aplicación cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', function() {
    // Comentario: Verificar que estamos en la página del menú
    if (!document.getElementById('productsGrid')) {
        console.warn('Página del menú no detectada');
        return;
    }

    // Comentario: Inicializar managers
    productManager = new ProductManager();
    cartManager = new CartManager();
    checkoutManager = new CheckoutManager();

    // Comentario: Cargar productos
    productManager.loadProducts();

    // Comentario: Configurar estado de la tienda
    updateStoreStatus();
    setInterval(updateStoreStatus, 60000);

    // Comentario: Configurar banner de horarios
    updateScheduleBanner();
    setInterval(updateScheduleBanner, 300000); // Cada 5 minutos

    // Comentario: Inicializar tema
    initTheme();

    // Comentario: Configurar funcionalidades
    setupLiveSearch();
    setupKeyboardShortcuts();
    setupModalEvents();

    // Comentario: Track de vista de página
    trackEvent('page_view_menu');

    console.log('🛒 TE LO VENDO RIOHACHA - Catálogo cargado');
    console.log('⌨️ Atajos: H = Inicio, W = WhatsApp, C = Carrito, ESC = Cerrar modal');
});

// === MANEJO DE ERRORES ===
window.addEventListener('error', (e) => {
    console.error('Error en el catálogo:', e.error);

    trackEvent('javascript_error', {
        error: e.error ? e.error.message : 'Unknown error',
        filename: e.filename,
        lineno: e.lineno
    });
});

// === MODAL DE PRODUCTO ===

/**
 * Comentario: Variables para el modal de producto
 */
let currentProductModal = null;
let currentImageIndex = 0;
let productImages = [];
let modalQuantity = 1;

/**
 * Comentario: Abrir modal de producto
 */
function openProductModal(productId) {
    const product = allProducts.find(p => p.ID === productId);
    if (!product) return;

    currentProductModal = product;
    modalQuantity = 1;

    // Comentario: Preparar imágenes del producto (soporte para múltiples imágenes)
    // Soporte para dos formatos:
    // 1. Múltiples columnas: URL_Imagen, URL_Imagen_2, URL_Imagen_3, etc.
    // 2. URLs separadas por comas en una sola columna: "url1,url2,url3"
    productImages = [];

    if (product.URL_Imagen) {
        // Comentario: Si URL_Imagen contiene comas, dividir por comas
        if (product.URL_Imagen.includes(',')) {
            productImages = product.URL_Imagen.split(',').map(url => url.trim()).filter(url => url.length > 0);
        } else {
            // Comentario: Si no tiene comas, usar formato de columnas múltiples
            productImages.push(product.URL_Imagen);
            if (product.URL_Imagen_2) productImages.push(product.URL_Imagen_2);
            if (product.URL_Imagen_3) productImages.push(product.URL_Imagen_3);
            if (product.URL_Imagen_4) productImages.push(product.URL_Imagen_4);
            if (product.URL_Imagen_5) productImages.push(product.URL_Imagen_5);
        }
    }

    currentImageIndex = 0;

    // Comentario: Actualizar contenido del modal
    document.getElementById('modalProductName').textContent = product.NombreProducto;
    document.getElementById('modalPriceNow').textContent = `$${product.PrecioFinal.toLocaleString()}`;
    document.getElementById('modalProductDescription').textContent = product.Descripcion;
    document.getElementById('modalQuantity').value = modalQuantity;

    // Comentario: Mostrar/ocultar precio anterior si hay descuento
    const hasDiscount = product.PrecioOriginal && product.PrecioOriginal > product.PrecioFinal;
    const priceBeforeElement = document.getElementById('modalPriceBefore');

    if (hasDiscount) {
        priceBeforeElement.classList.remove('hidden');
        priceBeforeElement.querySelector('.value').textContent = `$${product.PrecioOriginal.toLocaleString()}`;
    } else {
        priceBeforeElement.classList.add('hidden');
    }

    // Comentario: Configurar imagen principal
    updateModalImage();

    // Comentario: Mostrar/ocultar controles del carrusel
    const prevBtn = document.getElementById('prevImageBtn');
    const nextBtn = document.getElementById('nextImageBtn');
    const thumbnailsWrapper = document.getElementById('thumbnailsWrapper');

    if (productImages.length > 1) {
        prevBtn.classList.remove('hidden');
        nextBtn.classList.remove('hidden');
        thumbnailsWrapper.classList.remove('hidden');
        renderThumbnails();
        updateThumbnailNavButtons();
    } else {
        prevBtn.classList.add('hidden');
        nextBtn.classList.add('hidden');
        thumbnailsWrapper.classList.add('hidden');
    }

    // Comentario: Configurar selector de variantes si existen
    const variantsContainer = document.getElementById('modalVariants');
    const variantSelector = document.getElementById('variantSelector');

    console.log('Producto:', product);
    console.log('Variantes del producto:', product.Variantes);

    if (product.Variantes && product.Variantes.trim()) {
        const variants = product.Variantes.split(',').map(v => v.trim()).filter(v => v.length > 0);
        console.log('Variantes procesadas:', variants);

        // Limpiar opciones anteriores
        variantSelector.innerHTML = '';

        // Agregar opciones de variantes
        variants.forEach((variant, index) => {
            const option = document.createElement('option');
            option.value = variant;
            option.textContent = variant;
            // Seleccionar automáticamente la primera opción
            if (index === 0) {
                option.selected = true;
            }
            variantSelector.appendChild(option);
        });

        variantsContainer.classList.remove('hidden');
    } else {
        variantsContainer.classList.add('hidden');
    }

    // Comentario: Actualizar enlaces de WhatsApp del modal con la información completa del producto
    const whatsappButtons = document.querySelectorAll('.contact-btn.whatsapp');
    whatsappButtons.forEach((btn, index) => {
        btn.onclick = (e) => {
            e.preventDefault();
            openWhatsAppWithProduct(product, index + 1);
        };
    });

    // Comentario: Actualizar TAMBIÉN los enlaces del footer con el producto actual
    const footerWhatsappLinks = document.querySelectorAll('.contact-link.whatsapp-link');
    footerWhatsappLinks.forEach((link, index) => {
        link.onclick = (e) => {
            e.preventDefault();
            openWhatsAppWithProduct(product, index + 1);
        };
    });

    // Comentario: Mostrar modal
    const modal = document.getElementById('productModal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Comentario: Track evento
    trackEvent('product_modal_opened', {
        product_id: product.ID,
        product_name: product.NombreProducto
    });
}

/**
 * Comentario: Cerrar modal de producto
 */
function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    currentProductModal = null;
    productImages = [];
    currentImageIndex = 0;
    modalQuantity = 1;
}

/**
 * Comentario: Actualizar imagen principal del modal
 */
function updateModalImage() {
    const mainImage = document.getElementById('modalMainImage');
    const imageUrl = productImages[currentImageIndex];

    if (imageUrl && imageUrl.startsWith('http')) {
        mainImage.src = imageUrl;
        mainImage.alt = currentProductModal.NombreProducto;
    } else if (imageUrl) {
        // Comentario: Si es emoji o texto, mostrar como texto
        mainImage.src = '';
        mainImage.alt = imageUrl;
    }

    // Comentario: Actualizar thumbnails activos
    updateActiveThumbnail();
}

/**
 * Comentario: Renderizar thumbnails de imágenes
 */
function renderThumbnails() {
    const container = document.getElementById('imageThumbnails');
    container.innerHTML = productImages.map((url, index) => {
        if (url && url.startsWith('http')) {
            return `
                <div class="thumbnail ${index === currentImageIndex ? 'active' : ''}" onclick="goToImage(${index})">
                    <img src="${url}" alt="Imagen ${index + 1}">
                </div>
            `;
        }
        return '';
    }).join('');
}

/**
 * Comentario: Actualizar thumbnail activo
 */
function updateActiveThumbnail() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
        if (index === currentImageIndex) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

/**
 * Comentario: Ir a imagen específica
 */
function goToImage(index) {
    currentImageIndex = index;
    updateModalImage();
}

/**
 * Comentario: Imagen anterior en el carrusel
 */
function previousImage() {
    currentImageIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
    updateModalImage();
}

/**
 * Comentario: Siguiente imagen en el carrusel
 */
function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % productImages.length;
    updateModalImage();
}

/**
 * Comentario: Aumentar cantidad en el modal
 */
function increaseModalQuantity() {
    modalQuantity++;
    document.getElementById('modalQuantity').value = modalQuantity;
}

/**
 * Comentario: Disminuir cantidad en el modal
 */
function decreaseModalQuantity() {
    if (modalQuantity > 1) {
        modalQuantity--;
        document.getElementById('modalQuantity').value = modalQuantity;
    }
}

/**
 * Comentario: Agregar al carrito desde el modal
 */
function addToCartFromModal() {
    if (!currentProductModal) return;

    // Comentario: Obtener variante seleccionada si existe
    const variantSelector = document.getElementById('variantSelector');
    const variantsContainer = document.getElementById('modalVariants');

    if (!variantsContainer.classList.contains('hidden')) {
        const selectedVariant = variantSelector.value;

        // Guardar la variante seleccionada en el nombre del producto temporalmente
        const originalName = currentProductModal.NombreProducto;
        currentProductModal.NombreProducto = `${originalName} (${selectedVariant})`;

        // Agregar al carrito
        for (let i = 0; i < modalQuantity; i++) {
            addToCart(currentProductModal.ID);
        }

        // Restaurar nombre original
        currentProductModal.NombreProducto = originalName;
    } else {
        // Si no hay variantes, agregar normalmente
        for (let i = 0; i < modalQuantity; i++) {
            addToCart(currentProductModal.ID);
        }
    }

    // Comentario: Guardar info para tracking antes de cerrar modal
    const productIdForTracking = currentProductModal.ID;
    const productNameForTracking = currentProductModal.NombreProducto;

    // Comentario: Cerrar modal
    closeProductModal();

    // Comentario: Track evento
    trackEvent('add_to_cart_from_modal', {
        product_id: productIdForTracking,
        product_name: productNameForTracking,
        quantity: modalQuantity
    });
}

/**
 * Comentario: Desplazar thumbnails hacia izquierda o derecha
 */
function scrollThumbnails(direction) {
    const container = document.getElementById('imageThumbnails');
    const scrollAmount = 80; // 1 thumbnail (70px + 10px gap)

    if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
    } else {
        container.scrollLeft += scrollAmount;
    }

    // Comentario: Actualizar visibilidad de botones después de scroll
    setTimeout(updateThumbnailNavButtons, 100);
}

/**
 * Comentario: Actualizar visibilidad de botones de navegación de thumbnails
 */
function updateThumbnailNavButtons() {
    const container = document.getElementById('imageThumbnails');
    const prevBtn = document.getElementById('thumbPrevBtn');
    const nextBtn = document.getElementById('thumbNextBtn');

    if (!container || !prevBtn || !nextBtn) return;

    // Comentario: Mostrar botones solo si hay más de 3 imágenes
    if (productImages.length > 3) {
        const maxScroll = container.scrollWidth - container.clientWidth;
        const scrollPos = container.scrollLeft;

        // Comentario: Mostrar/ocultar botón izquierdo
        if (scrollPos > 5) {
            prevBtn.classList.add('visible');
        } else {
            prevBtn.classList.remove('visible');
        }

        // Comentario: Mostrar/ocultar botón derecho
        if (scrollPos < maxScroll - 5) {
            nextBtn.classList.add('visible');
        } else {
            nextBtn.classList.remove('visible');
        }
    } else {
        // Comentario: Si hay 3 o menos imágenes, ocultar botones
        prevBtn.classList.remove('visible');
        nextBtn.classList.remove('visible');
    }
}

/**
 * Comentario: Event listener para scroll de thumbnails
 */
if (document.getElementById('imageThumbnails')) {
    document.getElementById('imageThumbnails').addEventListener('scroll', updateThumbnailNavButtons);
}

// === FUNCIONES DEL CARRITO ===

/**
 * Comentario: Aumentar cantidad de un item en el carrito
 */
function increaseCartItemQuantity(productId) {
    const item = cartManager.cart.find(item => item.productId === productId);
    if (item) {
        cartManager.updateQuantity(productId, item.quantity + 1);
    }
}

/**
 * Comentario: Disminuir cantidad de un item en el carrito
 */
function decreaseCartItemQuantity(productId) {
    const item = cartManager.cart.find(item => item.productId === productId);
    if (item) {
        if (item.quantity > 1) {
            cartManager.updateQuantity(productId, item.quantity - 1);
        } else {
            // Comentario: Si la cantidad es 1, preguntar si desea eliminar
            if (confirm('¿Deseas eliminar este producto del carrito?')) {
                cartManager.removeFromCart(productId);
            }
        }
    }
}

/**
 * Comentario: Eliminar un item del carrito
 */
function removeCartItem(productId) {
    if (confirm('¿Estás seguro de eliminar este producto del carrito?')) {
        cartManager.removeFromCart(productId);
    }
}

/**
 * Comentario: Abrir WhatsApp con información del producto
 */
const WHATSAPP_NUMBERS = [
    '573007148250',  // WhatsApp 1 - Línea principal
    '573223639419',  // WhatsApp 2 - Línea de atención
    '573022801068'   // WhatsApp 3 - Línea de atención
];

function openWhatsAppWithProduct(product, whatsappIndex) {
    const phoneNumber = WHATSAPP_NUMBERS[whatsappIndex - 1];

    // Comentario: Si product es string (caso antiguo de compatibilidad), crear objeto simple
    if (typeof product === 'string') {
        product = { NombreProducto: product };
    }

    // Comentario: Generar mensaje completo con toda la información del producto
    let message = `🛍️ *Consulta de Producto*\n\n`;
    message += `📦 *Producto:* ${product.NombreProducto}\n`;

    // Agregar precio
    if (product.PrecioOferta && product.PrecioOferta > 0) {
        message += `💰 *Precio:* ~$${parseInt(product.PrecioNormal).toLocaleString()}~ ➜ *$${parseInt(product.PrecioOferta).toLocaleString()}*\n`;
        const descuento = Math.round(((product.PrecioNormal - product.PrecioOferta) / product.PrecioNormal) * 100);
        message += `🏷️ *Descuento:* ${descuento}% OFF\n`;
    } else if (product.PrecioNormal) {
        message += `💰 *Precio:* $${parseInt(product.PrecioNormal).toLocaleString()}\n`;
    }

    // Agregar categoría
    if (product.Categoria) {
        message += `📂 *Categoría:* ${product.Categoria}\n`;
    }

    // Agregar descripción si existe
    if (product.Descripcion && product.Descripcion.trim() !== '') {
        message += `\n📝 *Descripción:*\n${product.Descripcion}\n`;
    }

    // Agregar link de imagen si existe
    if (product.ImagenURL && product.ImagenURL.trim() !== '') {
        message += `\n🖼️ *Imagen:* ${product.ImagenURL}\n`;
    }

    message += `\n❓ *Consulta:*\n¿Está disponible este producto? ¿Cuál sería la forma de entrega y pago?`;

    const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');

    trackEvent('whatsapp_product_inquiry', {
        product_name: product.NombreProducto,
        product_id: product.ID || 'unknown',
        whatsapp_number: whatsappIndex,
        has_discount: product.PrecioOferta > 0
    });
}

/**
 * Comentario: Función para contacto general (cuando no hay producto específico)
 */
function openWhatsAppGeneral(whatsappIndex) {
    const phoneNumber = WHATSAPP_NUMBERS[whatsappIndex - 1];
    const message = `Hola, quisiera información sobre los productos de ${STORE_CONFIG.STORE_NAME}. ¿Qué productos tienen disponibles?`;
    const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');

    trackEvent('whatsapp_general_inquiry', {
        whatsapp_number: whatsappIndex
    });
}

/**
 * Comentario: Inicializar enlaces del footer al cargar la página
 */
function initializeFooterWhatsAppLinks() {
    const footerWhatsappLinks = document.querySelectorAll('.contact-link.whatsapp-link');
    footerWhatsappLinks.forEach((link, index) => {
        link.onclick = (e) => {
            e.preventDefault();
            // Por defecto, contacto general
            openWhatsAppGeneral(index + 1);
        };
    });
}

// === EXPORTAR FUNCIONES PARA USO GLOBAL ===
window.goHome = goHome;
window.openWhatsApp = openWhatsApp;
window.addToCart = addToCart;
window.filterByCategory = filterByCategory;
window.performSearch = performSearch;
window.clearSearch = clearSearch;
window.startCheckout = startCheckout;
window.closeCheckout = closeCheckout;
window.toggleDeliveryType = toggleDeliveryType;
window.confirmOrder = confirmOrder;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.previousImage = previousImage;
window.nextImage = nextImage;
window.goToImage = goToImage;
window.increaseModalQuantity = increaseModalQuantity;
window.decreaseModalQuantity = decreaseModalQuantity;
window.addToCartFromModal = addToCartFromModal;
window.scrollThumbnails = scrollThumbnails;
window.updateThumbnailNavButtons = updateThumbnailNavButtons;
window.increaseCartItemQuantity = increaseCartItemQuantity;
window.decreaseCartItemQuantity = decreaseCartItemQuantity;
window.removeCartItem = removeCartItem;
window.openWhatsAppWithProduct = openWhatsAppWithProduct;
window.openWhatsAppGeneral = openWhatsAppGeneral;

// === INICIALIZACIÓN AL CARGAR LA PÁGINA ===
document.addEventListener('DOMContentLoaded', function() {
    // Comentario: Inicializar enlaces del footer con contacto general
    initializeFooterWhatsAppLinks();
});