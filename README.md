# 🛒 TE LO VENDO RIOHACHA - E-Commerce Completo

## 📋 Descripción del Proyecto

**TE LO VENDO RIOHACHA** es un sistema completo de e-commerce desarrollado con tecnologías web modernas, integrado con Google Sheets para gestión de productos y optimizado para SEO. El sistema permite a los clientes navegar productos, gestionar un carrito de compras y realizar pedidos que se envían automáticamente por WhatsApp.

### 🎯 Características Principales

- ✅ **Catálogo dinámico** conectado a Google Sheets con sistema de gestión avanzado
- ✅ **Panel de gestión de productos** con macros y atajos de teclado (Google Apps Script)
- ✅ **Carrito persistente** con localStorage
- ✅ **Sistema de checkout completo** con WhatsApp
- ✅ **Estado automático** (Abierto/Cerrado) según horarios
- ✅ **Diseño responsive** mobile-first
- ✅ **SEO optimizado** con meta tags, sitemap y robots.txt
- ✅ **Dominio personalizado** con SSL (HTTPS)
- ✅ **Indexación en Google** configurada
- ✅ **Analíticas básicas** integradas

### 🌐 URLs del Proyecto

- **Sitio web:** https://telovendoriohacha.com
- **Repositorio:** https://github.com/Terminator123123/telovendoriohacha
- **Despliegue:** Netlify (actualización automática desde GitHub)

---

## 🏗️ Arquitectura del Sistema

### 📁 Estructura de Archivos

```
telovendo-nuevo/
├── index.html                      # Página principal de bienvenida
├── catalogo.html                   # Catálogo de productos
├── styles.css                      # Estilos de la página principal
├── catalogo-styles.css             # Estilos del catálogo
├── script-inicio.js                # Lógica de la página principal
├── script.js                       # Lógica del catálogo y carrito
├── product-modal.js                # Modal de productos
├── sitemap.xml                     # Mapa del sitio para Google
├── robots.txt                      # Instrucciones para bots de búsqueda
├── productos.csv                   # Archivo CSV de ejemplo
├── textos-interfaz.md              # Configuración de textos UI
├── LOGO.png                        # Logo de la empresa
├── README.md                       # Documentación principal
├── GUIA-SERVIDOR-LOCAL.md          # Guía para servidor local
└── google-sheets-scripts/          # Sistema de gestión de productos
    ├── Code.gs                     # Script principal con macros
    ├── PanelProductos.html         # Panel de agregar/editar
    ├── PanelBusqueda.html          # Panel de búsqueda
    ├── MANUAL-USUARIO-PRODUCTOS.md # Manual completo de usuario
    ├── GUIA-INSTALACION.md         # Instalación del sistema
    └── GUIA-OPTIMIZACION.md        # Optimizaciones implementadas
```

### 🔧 Tecnologías Utilizadas

**Frontend:**
- HTML5, CSS3, JavaScript ES6+ (Vanilla)
- Sin frameworks ni dependencias externas

**Backend/Integración:**
- Google Sheets como base de datos
- Google Apps Script para gestión de productos
- LocalStorage para persistencia del carrito

**Infraestructura:**
- GitHub para versionado
- Netlify para hosting y despliegue continuo
- Hostinger para dominio personalizado
- Google Search Console para SEO

**Comunicación:**
- WhatsApp Business API
- Google Maps Integration

---

## 🎨 Sistema de Gestión de Productos (Google Sheets)

### 📊 Estructura de la Hoja de Cálculo

| Columna | Nombre | Tipo | Descripción |
|---------|--------|------|-------------|
| A | ID | Número | Identificador único (auto-generado) |
| B | NombreProducto | Texto | Nombre del producto (max 100 caracteres) |
| C | Descripcion | Texto | Descripción detallada (max 300 caracteres) |
| D | Variantes | Texto | Opciones separadas por comas (Color, Talla, etc.) |
| E | PrecioOriginal | Número | Precio anterior (opcional, para descuentos) |
| F | PrecioFinal | Número | Precio de venta actual |
| G | URL_Imagen | URL | Enlace de la imagen del producto |
| H | Categoria | Texto | Categoría del producto |
| I | Visible | SI/NO | Si se muestra en el catálogo web |

### ⌨️ Macros y Atajos de Teclado

El sistema incluye **8 macros** para gestión rápida de productos:

| Atajo | Función | Descripción |
|-------|---------|-------------|
| **Ctrl + Alt + Shift + 1** | ➕ Agregar Producto | Abre panel para agregar nuevo producto |
| **Ctrl + Alt + Shift + 2** | ✏️ Editar Producto | Edita el producto seleccionado |
| **Ctrl + Alt + Shift + 3** | 🔍 Buscar Producto | Abre buscador de productos |
| **Ctrl + Alt + Shift + 4** | 👁️ Alternar Visibilidad | Oculta/muestra producto en catálogo |
| **Ctrl + Alt + Shift + 5** | 🔄 Duplicar Producto | Crea copia del producto seleccionado |
| **Ctrl + Alt + Shift + 6** | 🗑️ Eliminar Producto | Elimina producto permanentemente |
| **Ctrl + Alt + Shift + 7** | 📊 Ver Estadísticas | Muestra estadísticas de productos |
| **Ctrl + Alt + Shift + 8** | 🔄 Limpiar Caché | Actualiza lista de categorías |

### 📖 Menú de Productos en Google Sheets

El menú **📦 PRODUCTOS** incluye:
- 1️⃣ Agregar Nuevo Producto
- 2️⃣ Editar Producto Seleccionado
- 3️⃣ Alternar Visibilidad
- 4️⃣ Duplicar Producto
- 5️⃣ Eliminar Producto
- 6️⃣ Buscar Producto
- 7️⃣ Ver Estadísticas
- 8️⃣ Limpiar Caché

**Documentación completa:** `google-sheets-scripts/MANUAL-USUARIO-PRODUCTOS.md`

---

## 🔍 SEO y Optimización para Motores de Búsqueda

### ✅ Optimizaciones Implementadas

**Meta Tags Completos:**
- Títulos optimizados para búsqueda
- Descripciones atractivas con palabras clave
- Keywords: "telovendo riohacha", "tienda online riohacha", etc.
- Open Graph para redes sociales (Facebook, Twitter)
- Geolocalización (Riohacha, La Guajira, Colombia)

**Schema.org Markup:**
```json
{
  "@context": "https://schema.org",
  "@type": "Store",
  "name": "TE LO VENDO RIOHACHA",
  "address": {
    "streetAddress": "Talashi Local 219",
    "addressLocality": "Riohacha",
    "addressRegion": "La Guajira",
    "addressCountry": "CO"
  },
  "geo": {
    "latitude": "11.544444",
    "longitude": "-72.907222"
  }
}
```

**Archivos SEO:**
- `sitemap.xml` - Mapa del sitio para Google
- `robots.txt` - Permisos de rastreo para bots

**Google Search Console:**
- ✅ Dominio verificado
- ✅ Sitemap enviado
- ✅ Indexación solicitada
- ✅ Monitoreo de rendimiento activo

### 📈 Palabras Clave Objetivo

- telovendo riohacha
- tienda online riohacha
- productos riohacha
- talashi riohacha
- ecommerce riohacha
- compras online la guajira
- tienda virtual riohacha

---

## ⚙️ Configuración e Instalación

### 1. Configurar Google Sheets

1. **Crear hoja de cálculo** en Google Sheets
2. **Copiar estructura** de 9 columnas (ver tabla arriba)
3. **Instalar Google Apps Script:**
   - Extensiones → Apps Script
   - Copiar código de `google-sheets-scripts/Code.gs`
   - Copiar archivos HTML: `PanelProductos.html`, `PanelBusqueda.html`
   - Guardar y autorizar permisos

4. **Hacer pública la hoja:**
   - Compartir → "Cualquiera con el enlace puede ver"
   - Copiar ID de la hoja
   - Crear URL CSV: `https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv`

**Guía completa:** `google-sheets-scripts/GUIA-INSTALACION.md`

### 2. Configurar Variables del Sitio

Editar `script.js` líneas 3-10:

```javascript
const STORE_CONFIG = {
    GOOGLE_SHEET_URL: 'https://docs.google.com/spreadsheets/d/TU_SHEET_ID/export?format=csv',
    WHATSAPP_NUMBER: '573022788968',
    DELIVERY_COST: 5000,
    STORE_NAME: 'TE LO VENDO RIOHACHA',
    GOOGLE_MAPS_URL: 'https://maps.google.com/?q=Talashi+Local+219+Riohacha'
};
```

### 3. Configurar Horarios Comerciales

Editar `script.js` y `script-inicio.js`:

```javascript
businessHours: {
    monday:    { open: 9, close: 18 },
    tuesday:   { open: 9, close: 18 },
    wednesday: { open: 9, close: 18 },
    thursday:  { open: 9, close: 18 },
    friday:    { open: 9, close: 18 },
    saturday:  { open: 9, close: 14 },
    sunday:    { open: null, close: null }
}
```

---

## 🚀 Despliegue y Versionado

### Git y GitHub

**Configuración inicial (ya realizada):**
```bash
cd C:/ia/telovendoriohacha/telovendo-nuevo
git init
git remote add origin https://github.com/Terminator123123/telovendoriohacha.git
git branch -M main
```

**Flujo de trabajo para subir cambios:**
```bash
# 1. Agregar archivos modificados
git add .

# 2. Crear commit con descripción
git commit -m "Descripción de los cambios"

# 3. Subir a GitHub
git push origin main
```

**Ejemplo:**
```bash
git add catalogo.html
git commit -m "Actualización de precios de productos"
git push origin main
```

### Netlify (Despliegue Automático)

**Configuración:**
- ✅ Conectado al repositorio de GitHub
- ✅ Despliegue automático en cada push
- ✅ Dominio personalizado: telovendoriohacha.com
- ✅ SSL/HTTPS activado automáticamente

**Proceso de actualización:**
1. Hacer cambios en archivos locales
2. Subir a GitHub con git push
3. Netlify detecta cambios automáticamente (2-3 minutos)
4. Sitio actualizado en https://telovendoriohacha.com

### Dominio Personalizado (Hostinger)

**DNS configurado:**
- Nameservers apuntando a Netlify DNS
- Registro TXT para verificación de Google
- SSL/TLS certificado activo

---

## 🎨 Guía de Estilos

### Colores Principales

| Elemento | Color | Código |
|----------|-------|--------|
| Fondo principal | Degradado azul | #0E2244 → #083957 |
| Textos | Blanco | #FFFFFF |
| Botón principal | Azul oscuro | #044A76 |
| Sombra botón | Rojo | #B61414 |
| Footer | Azul muy oscuro | #0A131F |
| Acento dorado | Dorado | #FFD700 |

### Tipografía

- **Fuente principal:** Rubik (Google Fonts)
- **Pesos:** 300, 400, 500, 600, 700, 800, 900

### Dimensiones

- **Logo:** 80px × 80px
- **Imágenes de producto:** 350px altura (optimizado)
- **Max width contenedor:** 1200px

---

## 🚀 Funcionalidades Completas

### ✅ Página de Inicio (index.html)

- Estado automático Abierto/Cerrado según horarios
- Título "🤩Bienvenid@s TE LO VENDO RIOHACHA"
- Botón "Catálogo✅" con navegación
- Logo en esquina superior izquierda
- Integración WhatsApp y Google Maps
- Selector de tema claro/oscuro
- Diseño responsive y mobile-first

### ✅ Catálogo (catalogo.html)

- Carga dinámica desde Google Sheets
- Productos con imagen, precio original/final, descuentos
- Sistema de variantes (colores, tallas, etc.)
- Carrito persistente (localStorage)
- Búsqueda en tiempo real
- Filtros por categoría dinámicos
- Modal de producto con detalles completos
- Badges de descuento automáticos

### ✅ Sistema de Checkout

- Dos modalidades: "Recoger en Local" / "Domicilio"
- Formulario dinámico según tipo de entrega
- Campos con validación:
  - Nombre completo
  - Teléfono
  - Dirección (solo para domicilio)
  - Método de pago
- Resumen completo del pedido
- Cálculo automático de totales + domicilio
- Mensaje estructurado para WhatsApp
- Campos visibles con bordes claros

### ✅ Gestión de Productos (Google Sheets)

- Panel lateral para agregar productos
- Edición de productos existentes
- Búsqueda rápida de productos
- Duplicación de productos
- Alternar visibilidad (ocultar sin eliminar)
- Eliminación con confirmación
- Estadísticas de productos y categorías
- Sistema de caché para categorías
- Validaciones automáticas de datos

---

## 📱 Flujo de Usuario

### Para el Cliente

1. **Inicio** → Ver estado de tienda, acceder al catálogo
2. **Navegación** → Buscar, filtrar, explorar productos
3. **Selección** → Ver detalles, elegir variantes, agregar al carrito
4. **Carrito** → Modificar cantidades, eliminar productos
5. **Checkout** → Elegir modalidad, llenar formulario
6. **WhatsApp** → Confirmar pedido por WhatsApp

### Para el Administrador

1. **Google Sheets** → Abrir hoja de productos
2. **Menú 📦 PRODUCTOS** → Elegir acción
3. **Panel lateral** → Agregar/editar productos
4. **Guardar** → Cambios reflejados en el sitio
5. **Atajos** → Usar macros para gestión rápida

---

## ⌨️ Atajos de Teclado del Sitio Web

### Página de Inicio
- **M** → Ir al catálogo
- **W** → Abrir WhatsApp

### Página de Catálogo
- **H** → Volver al inicio
- **W** → Abrir WhatsApp
- **C** → Abrir carrito (si hay productos)
- **ESC** → Cerrar modal

---

## 📊 Sistema de Analíticas

### Eventos Trackeados

| Evento | Descripción | Datos |
|--------|-------------|-------|
| `page_view_index` | Vista página inicial | timestamp, userAgent |
| `page_view_menu` | Vista catálogo | timestamp, userAgent |
| `whatsapp_click` | Clic en WhatsApp | page, timestamp |
| `product_search` | Búsqueda realizada | query, resultsCount |
| `add_to_cart` | Producto agregado | productId, productName |
| `checkout_started` | Inicio checkout | itemCount |
| `order_confirmed` | Pedido confirmado | itemCount, totalValue, deliveryType |
| `javascript_error` | Error del sistema | error, filename, lineno |

### Acceso a Datos

```javascript
// En consola del navegador (F12)
const analytics = JSON.parse(localStorage.getItem('store_analytics'));
console.table(analytics);

// Filtrar eventos
const orders = analytics.filter(e => e.event === 'order_confirmed');
```

---

## 🔒 Seguridad y Privacidad

### Medidas Implementadas

- ✅ HTTPS obligatorio en producción
- ✅ Validación de inputs en formularios
- ✅ Sanitización de datos antes de procesamiento
- ✅ No almacenamiento de datos sensibles en cliente
- ✅ Google Sheets público solo con productos
- ✅ Analytics sin datos personales

### Datos Manejados

- **Públicos:** Productos, precios, imágenes, categorías
- **Temporales:** Carrito (localStorage), analytics (localStorage)
- **Privados:** Ninguno almacenado permanentemente

---

## 🐛 Solución de Problemas

### Productos no cargan
1. Verificar URL de Google Sheets en `script.js`
2. Confirmar permisos públicos de la hoja
3. Validar estructura de 9 columnas
4. Revisar consola del navegador (F12)

### WhatsApp no funciona
1. Verificar número con código de país
2. Formato correcto: `573022788968`
3. Sin espacios, guiones ni símbolos

### Cambios no se reflejan
1. Hacer push a GitHub: `git push origin main`
2. Esperar 2-3 minutos (despliegue de Netlify)
3. Limpiar caché del navegador (Ctrl + Shift + R)

### Sitio no aparece en Google
1. Verificar Google Search Console
2. Confirmar sitemap enviado
3. Solicitar indexación manual
4. Esperar 3-7 días para indexación completa

---

## 📈 Rendimiento

### Métricas Objetivo

- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- **First Input Delay:** < 100ms
- **Total Blocking Time:** < 300ms

### Optimizaciones

- Lazy loading de imágenes
- Debounced search (evita requests excesivas)
- Efficient DOM manipulation
- Minimal HTTP requests
- Gzip compression automática
- Cache de Google Sheets

---

## 📚 Documentación Adicional

### Archivos de Documentación

- `MANUAL-USUARIO-PRODUCTOS.md` - Manual completo de gestión de productos
- `GUIA-INSTALACION.md` - Instalación del sistema de Google Sheets
- `GUIA-OPTIMIZACION.md` - Optimizaciones implementadas
- `GUIA-SERVIDOR-LOCAL.md` - Configuración de servidor local y ngrok
- `textos-interfaz.md` - Textos configurables de la UI

### Registros de Conversación

- Carpeta `reguistro de conversaciones/` contiene todos los registros de desarrollo
- Documentación detallada de cada cambio implementado
- Historial completo del proyecto

---

## 📠 Información de Contacto

### Negocio

- **Nombre:** TE LO VENDO RIOHACHA
- **Ubicación:** Talashi Local 219, Riohacha, La Guajira
- **WhatsApp:** +57 302 278 8968
- **Sitio web:** https://telovendoriohacha.com

### Desarrollador

- **Email:** shalemr83@gmail.com
- **Especialización:** Sistemas web escalables y e-commerce
- **Metodología:** SOLID, DRY, KISS, YAGNI

---

## ✨ Características Técnicas Destacadas

✅ **Vanilla JavaScript** - Sin dependencias externas, máxima compatibilidad
✅ **Mobile-first Design** - Optimizado para dispositivos móviles
✅ **Progressive Enhancement** - Funcionalidad básica sin JavaScript
✅ **Offline Resilience** - Manejo inteligente de errores de conectividad
✅ **Real-time Updates** - Sincronización automática con Google Sheets
✅ **Accessibility Compliant** - ARIA labels y navegación por teclado
✅ **SEO Optimized** - Meta tags, sitemap, robots.txt, Schema.org
✅ **Analytics Ready** - Sistema de métricas integrado
✅ **Git Version Control** - Historial completo de cambios
✅ **Continuous Deployment** - Despliegue automático con Netlify
✅ **Custom Domain** - Dominio personalizado con SSL
✅ **Google Indexed** - Configurado en Google Search Console
✅ **Admin Panel** - Gestión completa desde Google Sheets
✅ **Keyboard Shortcuts** - Macros para productividad

---

## 🚀 Estado del Proyecto

**Versión:** 2.0.0
**Última actualización:** 21 Octubre 2025
**Estado:** ✅ Producción
**Dominio:** https://telovendoriohacha.com
**Hosting:** Netlify
**SEO:** Optimizado e indexado
**Sistema de gestión:** Google Sheets con macros

### ✅ Completado

- [x] Diseño responsive mobile-first
- [x] Catálogo dinámico con Google Sheets
- [x] Sistema de carrito persistente
- [x] Checkout con WhatsApp
- [x] Panel de gestión de productos
- [x] Macros y atajos de teclado
- [x] Optimización SEO completa
- [x] Dominio personalizado con SSL
- [x] Indexación en Google
- [x] Despliegue continuo
- [x] Sistema de analíticas
- [x] Documentación completa

---

**🎉 Sistema completamente funcional y optimizado para producción**

Para más información, consulta la documentación específica en la carpeta `google-sheets-scripts/` o los registros de conversación en `reguistro de conversaciones/`.
