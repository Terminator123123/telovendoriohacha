// === CONFIGURACIÓN DE LA TIENDA ===
const STORE_CONFIG = {
    name: 'TE LO VENDO RIOHACHA',
    whatsappNumber: '573022788968', // Número real de WhatsApp
    googleMapsUrl: 'https://maps.app.goo.gl/iDLS8qAVYFDYNmWw6', // URL real de Google Maps
    // Horario: Lunes a Sábado de 9am a 8pm, Domingo 9am a 1pm
    businessHours: {
        monday: { open: 9, close: 20 },
        tuesday: { open: 9, close: 20 },
        wednesday: { open: 9, close: 20 },
        thursday: { open: 9, close: 20 },
        friday: { open: 9, close: 20 },
        saturday: { open: 9, close: 20 },
        sunday: { open: 9, close: 13 } // Abierto los domingos hasta 1pm
    }
};

// === FUNCIONES PRINCIPALES ===

/**
 * Comentario: Función para determinar el estado de la tienda
 * Verifica si la tienda está abierta según el día y hora actual
 */
function getStoreStatus() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Domingo) a 6 (Sábado)
    const hour = now.getHours();

    // Comentario: Mapear números de día a nombres
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = dayNames[dayOfWeek];

    // Comentario: Obtener horarios del día actual
    const todayHours = STORE_CONFIG.businessHours[currentDay];

    // Comentario: Si no hay horarios definidos (ej: domingo), está cerrado
    if (!todayHours.open || !todayHours.close) {
        return { isOpen: false, status: 'Cerrado' };
    }

    // Comentario: Verificar si la hora actual está dentro del horario comercial
    const isOpen = hour >= todayHours.open && hour < todayHours.close;

    return {
        isOpen: isOpen,
        status: isOpen ? 'Abierto' : 'Cerrado'
    };
}

/**
 * Comentario: Actualizar el elemento en el DOM con el estado actual
 */
function updateStoreStatusDisplay() {
    const storeStatus = getStoreStatus();
    const statusElement = document.getElementById('store-status');
    const indicatorElement = document.getElementById('status-indicator');

    if (statusElement && indicatorElement) {
        // Comentario: Actualizar texto del estado
        statusElement.textContent = storeStatus.status;

        // Comentario: Actualizar indicador visual
        if (storeStatus.isOpen) {
            indicatorElement.classList.remove('closed');
        } else {
            indicatorElement.classList.add('closed');
        }
    }
}

/**
 * Comentario: Función para abrir WhatsApp con mensaje predefinido
 */
function openWhatsApp() {
    const message = encodeURIComponent(
        `¡Hola! Me interesa conocer más sobre los productos de ${STORE_CONFIG.name}. ¿Podrían ayudarme?`
    );

    const whatsappUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${message}`;

    // Comentario: Abrir WhatsApp en nueva ventana/pestaña
    window.open(whatsappUrl, '_blank');

    // Comentario: Track del evento para analíticas
    trackEvent('whatsapp_click_home');
}

/**
 * Comentario: Función para abrir Google Maps con la ubicación de la tienda
 */
function openGoogleMaps() {
    // Comentario: Abrir Google Maps en nueva ventana/pestaña
    window.open(STORE_CONFIG.googleMapsUrl, '_blank');

    // Comentario: Track del evento para analíticas
    trackEvent('maps_click_home');
}

/**
 * Comentario: Función para navegar al menú/catálogo
 */
function goToMenu() {
    // Comentario: Track del evento antes de navegar
    trackEvent('menu_button_click');

    // Comentario: Animación suave de transición
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '0';

    // Comentario: Navegar después de la animación
    setTimeout(() => {
        window.location.href = 'categoria.html';
    }, 300);
}

/**
 * Comentario: Sistema simple de analíticas para tracking
 */
function trackEvent(eventName, data = {}) {
    try {
        const eventData = {
            event: eventName,
            timestamp: new Date().toISOString(),
            page: 'home',
            userAgent: navigator.userAgent,
            ...data
        };

        // Comentario: Guardar en localStorage para análisis posterior
        const events = JSON.parse(localStorage.getItem('store_analytics') || '[]');
        events.push(eventData);

        // Comentario: Mantener solo los últimos 100 eventos
        if (events.length > 100) {
            events.splice(0, events.length - 100);
        }

        localStorage.setItem('store_analytics', JSON.stringify(events));
    } catch (error) {
        console.error('Error tracking event:', error);
    }
}

/**
 * Comentario: Función para obtener próximo horario de apertura
 */
function getNextOpenTime() {
    const now = new Date();
    const currentDay = now.getDay();
    const currentHour = now.getHours();

    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayNamesES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    // Comentario: Verificar si abrirá más tarde hoy
    const todayKey = dayNames[currentDay];
    const todayHours = STORE_CONFIG.businessHours[todayKey];

    if (todayHours.open && currentHour < todayHours.open) {
        return `Abre hoy a las ${todayHours.open}:00`;
    }

    // Comentario: Buscar el próximo día de apertura
    for (let i = 1; i <= 7; i++) {
        const nextDayIndex = (currentDay + i) % 7;
        const nextDayKey = dayNames[nextDayIndex];
        const nextDayHours = STORE_CONFIG.businessHours[nextDayKey];

        if (nextDayHours.open) {
            const dayName = dayNamesES[nextDayIndex];
            return `Abre ${dayName} a las ${nextDayHours.open}:00`;
        }
    }

    return 'Horarios no disponibles';
}

/**
 * Comentario: Mostrar información adicional del estado en tooltip
 */
function addStatusTooltip() {
    const statusContainer = document.querySelector('.store-status');

    if (statusContainer) {
        const storeStatus = getStoreStatus();

        if (!storeStatus.isOpen) {
            const nextOpen = getNextOpenTime();
            statusContainer.title = nextOpen;
        } else {
            const now = new Date();
            const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const currentDay = dayNames[now.getDay()];
            const todayHours = STORE_CONFIG.businessHours[currentDay];

            if (todayHours.close) {
                statusContainer.title = `Cierra a las ${todayHours.close}:00`;
            }
        }
    }
}

/**
 * Comentario: Efectos visuales y animaciones
 */
function initVisualEffects() {
    // Comentario: Animación de entrada suave
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Comentario: Efectos de hover para elementos interactivos
    const interactiveElements = document.querySelectorAll('.location-container, .whatsapp-btn, .menu-button');

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = element.classList.contains('menu-button') ?
                'translateY(-3px)' : 'translateY(-2px)';
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Comentario: Atajos de teclado para mejor UX
 */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Comentario: M para ir al menú
        if (e.key === 'm' || e.key === 'M') {
            if (e.target.tagName !== 'INPUT') {
                goToMenu();
            }
        }

        // Comentario: W para WhatsApp
        if (e.key === 'w' || e.key === 'W') {
            if (e.target.tagName !== 'INPUT') {
                openWhatsApp();
            }
        }
    });
}

// === INICIALIZACIÓN ===

/**
 * Comentario: Inicializar la aplicación cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', function() {
    // Comentario: Configurar estado inicial de la tienda
    updateStoreStatusDisplay();

    // Comentario: Agregar tooltip con información adicional
    addStatusTooltip();

    // Comentario: Inicializar efectos visuales
    initVisualEffects();

    // Comentario: Configurar atajos de teclado
    initKeyboardShortcuts();

    // Comentario: Actualizar estado cada minuto
    setInterval(() => {
        updateStoreStatusDisplay();
        addStatusTooltip();
    }, 60000);

    // Comentario: Track de vista de página
    trackEvent('page_view_home');

    console.log('🏪 TE LO VENDO RIOHACHA - Página de inicio cargada');
    console.log('📱 Atajos: M = Menú, W = WhatsApp');
});

// === MANEJO DE ERRORES ===
window.addEventListener('error', (e) => {
    console.error('Error en la página de inicio:', e.error);

    // Comentario: Track de errores para debugging
    trackEvent('javascript_error', {
        error: e.error ? e.error.message : 'Unknown error',
        filename: e.filename,
        lineno: e.lineno
    });
});

// === EXPORTAR FUNCIONES GLOBALES ===
window.openWhatsApp = openWhatsApp;
window.openGoogleMaps = openGoogleMaps;
window.goToMenu = goToMenu;