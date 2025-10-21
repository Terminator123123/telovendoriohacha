// === GESTOR DEL MODAL DE PRODUCTO ===
class ProductModal {
    constructor() {
        this.isOpen = false;
        this.currentProduct = null;
        this.currentImageIndex = 0;
        this.images = [];
        this.videos = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupKeyboardNavigation();
    }

    // === SETUP DE EVENT LISTENERS ===
    setupEventListeners() {
        // Cerrar modal al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.close();
            }
        });

        // Prevenir cierre cuando se hace clic dentro del modal
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;

            switch(e.key) {
                case 'Escape':
                    this.close();
                    break;
                case 'ArrowLeft':
                    this.previousImage();
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    break;
            }
        });
    }

    // === ABRIR Y CERRAR MODAL ===
    open(product) {
        if (!product) return;

        this.currentProduct = product;
        this.loadProductData(product);
        this.showModal();
        this.isOpen = true;

        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';

        // Track del evento
        if (window.storeApp && window.storeApp.analytics) {
            window.storeApp.analytics.trackEvent('product_detail_view', {
                productName: product.name,
                productPrice: product.currentPrice
            });
        }
    }

    close() {
        this.hideModal();
        this.isOpen = false;
        this.currentProduct = null;
        this.currentImageIndex = 0;
        this.images = [];
        this.videos = [];

        // Restaurar scroll del body
        document.body.style.overflow = '';
    }

    showModal() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.style.display = 'flex';
            // Pequeño delay para la animación
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
        }
    }

    hideModal() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    // === CARGA DE DATOS DEL PRODUCTO ===
    loadProductData(product) {
        // Cargar información básica
        this.setProductInfo(product);

        // Cargar imágenes
        this.loadImages(product);

        // Cargar videos
        this.loadVideos(product);

        // Resetear cantidad
        this.setQuantity(1);
    }

    setProductInfo(product) {
        // Nombre del producto
        const nameElement = document.getElementById('modalProductName');
        if (nameElement) {
            nameElement.textContent = product.name || 'Producto sin nombre';
        }

        // Precio actual
        const currentPriceElement = document.getElementById('modalCurrentPrice');
        if (currentPriceElement) {
            currentPriceElement.textContent = window.formatPrice ?
                window.formatPrice(product.currentPrice) :
                `$${product.currentPrice?.toLocaleString() || '0'}`;
        }

        // Precio original y descuento
        const originalPriceElement = document.getElementById('modalOriginalPrice');
        const discountBadgeElement = document.getElementById('modalDiscountBadge');

        if (product.originalPrice && product.originalPrice > product.currentPrice) {
            if (originalPriceElement) {
                originalPriceElement.textContent = window.formatPrice ?
                    window.formatPrice(product.originalPrice) :
                    `$${product.originalPrice.toLocaleString()}`;
                originalPriceElement.style.display = 'inline';
            }

            if (discountBadgeElement) {
                const discount = Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100);
                discountBadgeElement.textContent = `-${discount}%`;
                discountBadgeElement.style.display = 'inline';
            }
        } else {
            if (originalPriceElement) originalPriceElement.style.display = 'none';
            if (discountBadgeElement) discountBadgeElement.style.display = 'none';
        }

        // Descripción
        const descriptionElement = document.getElementById('modalProductDescription');
        if (descriptionElement) {
            descriptionElement.textContent = product.description ||
                'Este producto no tiene descripción disponible.';
        }
    }

    loadImages(product) {
        // Parsear imágenes del producto
        this.images = this.parseImages(product);

        if (this.images.length === 0) {
            // Imagen por defecto si no hay imágenes
            this.images = ['https://via.placeholder.com/400x400?text=Sin+Imagen'];
        }

        this.currentImageIndex = 0;
        this.displayCurrentImage();
        this.createThumbnails();
    }

    parseImages(product) {
        const images = [];

        // Verificar diferentes campos donde pueden estar las imágenes
        if (product.images && Array.isArray(product.images)) {
            images.push(...product.images);
        } else if (product.imageUrls && Array.isArray(product.imageUrls)) {
            images.push(...product.imageUrls);
        } else if (product.image && typeof product.image === 'string') {
            // Si es una sola imagen o URLs separadas por comas
            const imageList = product.image.split(',').map(url => url.trim()).filter(url => url);
            images.push(...imageList);
        } else if (product.URL_Imagen && typeof product.URL_Imagen === 'string') {
            // Compatibilidad con el formato del Google Sheets
            const imageList = product.URL_Imagen.split(',').map(url => url.trim()).filter(url => url);
            images.push(...imageList);
        }

        // Filtrar URLs válidas
        return images.filter(url => url && url.startsWith('http'));
    }

    displayCurrentImage() {
        const mainImageElement = document.getElementById('modalMainImage');
        if (mainImageElement && this.images.length > 0) {
            mainImageElement.src = this.images[this.currentImageIndex];
            mainImageElement.alt = this.currentProduct?.name || 'Producto';
        }

        // Actualizar navegación
        this.updateImageNavigation();
    }

    createThumbnails() {
        const thumbnailContainer = document.getElementById('modalThumbnails');
        if (!thumbnailContainer) return;

        thumbnailContainer.innerHTML = '';

        if (this.images.length <= 1) {
            thumbnailContainer.style.display = 'none';
            return;
        }

        thumbnailContainer.style.display = 'flex';

        this.images.forEach((imageUrl, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = imageUrl;
            thumbnail.className = `thumbnail ${index === this.currentImageIndex ? 'active' : ''}`;
            thumbnail.alt = `Imagen ${index + 1}`;
            thumbnail.addEventListener('click', () => this.selectImage(index));

            thumbnailContainer.appendChild(thumbnail);
        });
    }

    updateImageNavigation() {
        const prevBtn = document.querySelector('.nav-btn.prev');
        const nextBtn = document.querySelector('.nav-btn.next');

        if (this.images.length <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
        } else {
            if (prevBtn) prevBtn.style.display = 'block';
            if (nextBtn) nextBtn.style.display = 'block';
        }

        // Actualizar thumbnails activos
        document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentImageIndex);
        });
    }

    // === NAVEGACIÓN DE IMÁGENES ===
    previousImage() {
        if (this.images.length <= 1) return;

        this.currentImageIndex = this.currentImageIndex === 0 ?
            this.images.length - 1 :
            this.currentImageIndex - 1;

        this.displayCurrentImage();
    }

    nextImage() {
        if (this.images.length <= 1) return;

        this.currentImageIndex = this.currentImageIndex === this.images.length - 1 ?
            0 :
            this.currentImageIndex + 1;

        this.displayCurrentImage();
    }

    selectImage(index) {
        if (index >= 0 && index < this.images.length) {
            this.currentImageIndex = index;
            this.displayCurrentImage();
        }
    }

    // === GESTIÓN DE VIDEOS ===
    loadVideos(product) {
        this.videos = this.parseVideos(product);

        const videoSection = document.getElementById('modalVideoSection');
        const videoContainer = document.getElementById('modalVideoContainer');

        if (this.videos.length > 0 && videoSection && videoContainer) {
            this.displayVideos();
            videoSection.style.display = 'block';
        } else if (videoSection) {
            videoSection.style.display = 'none';
        }
    }

    parseVideos(product) {
        const videos = [];

        // Verificar diferentes campos donde pueden estar los videos
        if (product.videos && Array.isArray(product.videos)) {
            videos.push(...product.videos);
        } else if (product.videoUrls && Array.isArray(product.videoUrls)) {
            videos.push(...product.videoUrls);
        } else if (product.video && typeof product.video === 'string') {
            const videoList = product.video.split(',').map(url => url.trim()).filter(url => url);
            videos.push(...videoList);
        } else if (product.URL_Video && typeof product.URL_Video === 'string') {
            const videoList = product.URL_Video.split(',').map(url => url.trim()).filter(url => url);
            videos.push(...videoList);
        }

        // Filtrar URLs válidas
        return videos.filter(url => url && (url.includes('youtube') || url.includes('vimeo') || url.startsWith('http')));
    }

    displayVideos() {
        const videoContainer = document.getElementById('modalVideoContainer');
        if (!videoContainer) return;

        videoContainer.innerHTML = '';

        this.videos.forEach((videoUrl, index) => {
            const videoElement = this.createVideoElement(videoUrl, index);
            if (videoElement) {
                videoContainer.appendChild(videoElement);
            }
        });
    }

    createVideoElement(videoUrl, index) {
        if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
            return this.createYouTubeEmbed(videoUrl, index);
        } else if (videoUrl.includes('vimeo.com')) {
            return this.createVimeoEmbed(videoUrl, index);
        } else {
            return this.createDirectVideoElement(videoUrl, index);
        }
    }

    createYouTubeEmbed(url, index) {
        const videoId = this.extractYouTubeId(url);
        if (!videoId) return null;

        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
        iframe.className = 'video-embed';
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', '');
        iframe.title = `Video ${index + 1}`;

        return iframe;
    }

    createVimeoEmbed(url, index) {
        const videoId = url.split('/').pop();
        if (!videoId) return null;

        const iframe = document.createElement('iframe');
        iframe.src = `https://player.vimeo.com/video/${videoId}`;
        iframe.className = 'video-embed';
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', '');
        iframe.title = `Video ${index + 1}`;

        return iframe;
    }

    createDirectVideoElement(url, index) {
        const video = document.createElement('video');
        video.src = url;
        video.className = 'direct-video';
        video.controls = true;
        video.title = `Video ${index + 1}`;

        return video;
    }

    extractYouTubeId(url) {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : null;
    }

    // === GESTIÓN DE CANTIDAD ===
    setQuantity(quantity) {
        const quantityInput = document.getElementById('modalQuantity');
        if (quantityInput) {
            quantityInput.value = Math.max(1, parseInt(quantity) || 1);
        }
    }

    getQuantity() {
        const quantityInput = document.getElementById('modalQuantity');
        return quantityInput ? Math.max(1, parseInt(quantityInput.value) || 1) : 1;
    }

    increaseQuantity() {
        const currentQuantity = this.getQuantity();
        this.setQuantity(currentQuantity + 1);
    }

    decreaseQuantity() {
        const currentQuantity = this.getQuantity();
        if (currentQuantity > 1) {
            this.setQuantity(currentQuantity - 1);
        }
    }

    // === ACCIONES DE COMPRA ===
    addToCart() {
        if (!this.currentProduct || !window.productManager) return;

        const quantity = this.getQuantity();
        window.productManager.addToCart(this.currentProduct.id, quantity);

        // Mostrar confirmación
        this.showAddedToCartConfirmation();

        // Track del evento
        if (window.storeApp && window.storeApp.analytics) {
            window.storeApp.analytics.trackEvent('add_to_cart', {
                productName: this.currentProduct.name,
                quantity: quantity,
                totalValue: this.currentProduct.currentPrice * quantity
            });
        }
    }

    orderViaWhatsApp() {
        if (!this.currentProduct) return;

        const quantity = this.getQuantity();
        const totalPrice = this.currentProduct.currentPrice * quantity;

        const message = `¡Hola! Me interesa este producto:\n\n` +
            `📦 *${this.currentProduct.name}*\n` +
            `💰 Precio: $${this.currentProduct.currentPrice.toLocaleString()}\n` +
            `📊 Cantidad: ${quantity}\n` +
            `💵 Total: $${totalPrice.toLocaleString()}\n\n` +
            `¿Está disponible y cuál sería la forma de entrega?`;

        const whatsappNumber = window.STORE_CONFIG ? window.STORE_CONFIG.WHATSAPP_NUMBER : '573022788968';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        // Track del evento
        if (window.storeApp && window.storeApp.analytics) {
            window.storeApp.analytics.trackEvent('whatsapp_order', {
                productName: this.currentProduct.name,
                quantity: quantity,
                totalValue: totalPrice
            });
        }
    }

    showAddedToCartConfirmation() {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                ✅ Producto agregado al carrito
            </div>
        `;

        document.body.appendChild(notification);

        // Mostrar con animación
        setTimeout(() => notification.classList.add('show'), 100);

        // Ocultar después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// === FUNCIONES GLOBALES ===
window.productModal = new ProductModal();

// Función para abrir el modal desde cualquier parte
window.openProductModal = function(product) {
    window.productModal.open(product);
};

// Función para abrir el modal por ID del producto
window.openProductModalById = function(productId) {
    // Usar el productManager global de telovendo-nuevo
    if (!window.productManager || !window.productManager.products) {
        console.error('ProductManager no está disponible');
        return;
    }

    // Buscar producto en la estructura de telovendo-nuevo
    const product = window.productManager.products.find(p => p.ID == productId);
    if (!product) {
        console.error('Producto no encontrado con ID:', productId);
        return;
    }

    // Convertir formato de telovendo-nuevo al formato esperado por el modal
    const modalProduct = {
        id: product.ID,
        name: product.NombreProducto,
        description: product.Descripcion,
        currentPrice: product.PrecioFinal,
        originalPrice: product.PrecioOriginal,
        images: [product.URL_Imagen], // Por ahora solo una imagen
        videos: [], // Agregar soporte después
        inStock: true
    };

    window.productModal.open(modalProduct);
};

// Función para cerrar el modal
window.closeProductModal = function() {
    window.productModal.close();
};

// Navegación de imágenes
window.previousImage = function() {
    window.productModal.previousImage();
};

window.nextImage = function() {
    window.productModal.nextImage();
};

// Control de cantidad
window.increaseQuantity = function() {
    window.productModal.increaseQuantity();
};

window.decreaseQuantity = function() {
    window.productModal.decreaseQuantity();
};

// Acciones de compra
window.addToCartFromModal = function() {
    window.productModal.addToCart();
};

window.orderViaWhatsApp = function() {
    window.productModal.orderViaWhatsApp();
};

// === ESTILOS DEL MODAL ===
const modalStyles = `
    .product-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .product-modal.active {
        opacity: 1;
    }

    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
    }

    .modal-content {
        position: relative;
        background: white;
        border-radius: 12px;
        max-width: 90vw;
        max-height: 90vh;
        width: 800px;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        transform: scale(0.9);
        transition: transform 0.3s ease;
    }

    .product-modal.active .modal-content {
        transform: scale(1);
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #eee;
        background: #f8f9fa;
    }

    .modal-title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: #333;
    }

    .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
        padding: 5px;
        border-radius: 50%;
        transition: all 0.2s ease;
    }

    .modal-close:hover {
        background: #e9ecef;
        color: #333;
    }

    .modal-body {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        padding: 20px;
        max-height: calc(90vh - 100px);
        overflow-y: auto;
    }

    .media-section {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .image-gallery {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .main-image-container {
        position: relative;
        width: 100%;
        aspect-ratio: 1;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #eee;
    }

    .main-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }

    .image-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 0 10px;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .main-image-container:hover .image-nav {
        opacity: 1;
    }

    .nav-btn {
        background: rgba(0, 0, 0, 0.7);
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }

    .nav-btn:hover {
        background: rgba(0, 0, 0, 0.9);
        transform: scale(1.1);
    }

    .thumbnail-container {
        overflow-x: auto;
        padding: 5px 0;
    }

    .thumbnails {
        display: flex;
        gap: 10px;
        min-width: max-content;
    }

    .thumbnail {
        width: 60px;
        height: 60px;
        border-radius: 6px;
        cursor: pointer;
        object-fit: cover;
        border: 2px solid transparent;
        transition: all 0.2s ease;
    }

    .thumbnail:hover {
        border-color: #007bff;
        transform: scale(1.05);
    }

    .thumbnail.active {
        border-color: #007bff;
        box-shadow: 0 0 10px rgba(0, 123, 255, 0.3);
    }

    .video-section h3 {
        margin: 0 0 15px 0;
        font-size: 1.2rem;
        color: #333;
    }

    .video-container {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .video-embed,
    .direct-video {
        width: 100%;
        height: 200px;
        border-radius: 8px;
        border: 1px solid #eee;
    }

    .product-info-section {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .price-section {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
    }

    .current-price {
        font-size: 1.8rem;
        font-weight: bold;
        color: #28a745;
    }

    .original-price {
        font-size: 1.2rem;
        color: #6c757d;
        text-decoration: line-through;
    }

    .discount-badge {
        background: #dc3545;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.9rem;
        font-weight: bold;
    }

    .product-description {
        line-height: 1.6;
        color: #555;
        font-size: 1rem;
    }

    .product-actions {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .quantity-selector {
        display: flex;
        align-items: center;
        gap: 10px;
        justify-content: center;
    }

    .qty-btn {
        background: #007bff;
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 18px;
        font-weight: bold;
        transition: all 0.2s ease;
    }

    .qty-btn:hover {
        background: #0056b3;
        transform: scale(1.05);
    }

    .qty-input {
        width: 80px;
        height: 40px;
        text-align: center;
        border: 2px solid #dee2e6;
        border-radius: 6px;
        font-size: 16px;
        font-weight: bold;
    }

    .add-to-cart-btn,
    .whatsapp-order-btn {
        padding: 12px 20px;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: center;
    }

    .add-to-cart-btn {
        background: #28a745;
        color: white;
    }

    .add-to-cart-btn:hover {
        background: #218838;
        transform: translateY(-2px);
    }

    .whatsapp-order-btn {
        background: #25d366;
        color: white;
    }

    .whatsapp-order-btn:hover {
        background: #20bf5a;
        transform: translateY(-2px);
    }

    .cart-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    }

    .cart-notification.show {
        transform: translateX(0);
    }

    .notification-content {
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        font-weight: 500;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .modal-content {
            width: 95vw;
            max-height: 95vh;
        }

        .modal-body {
            grid-template-columns: 1fr;
            gap: 15px;
            padding: 15px;
        }

        .modal-title {
            font-size: 1.2rem;
        }

        .current-price {
            font-size: 1.5rem;
        }

        .qty-input {
            width: 60px;
        }
    }

    @media (max-width: 480px) {
        .modal-header {
            padding: 15px;
        }

        .modal-body {
            padding: 10px;
        }

        .quantity-selector {
            flex-direction: row;
            justify-content: space-between;
        }

        .video-embed,
        .direct-video {
            height: 150px;
        }
    }
`;

// Agregar estilos al documento
const modalStyleSheet = document.createElement('style');
modalStyleSheet.textContent = modalStyles;
document.head.appendChild(modalStyleSheet);
