# 📝 TEXTOS DE LA INTERFAZ - TE LO VENDO RIOHACHA

Este archivo contiene TODOS los textos que le aparecen al cliente en la página web.
Modifica este archivo y luego pídeme que actualice los textos en el código.

---

## 🏪 INFORMACIÓN DE LA TIENDA

### Nombre de la tienda
```
TE LO VENDO RIOHACHA
```
**Dónde aparece:** En el header de todas las páginas

---

## 🎯 PÁGINA DE INICIO (index.html)

### Título de la página (pestaña del navegador)
```
🤩Bienvenid@s TE LO VENDO RIOHACHA
```
**Dónde aparece:** En la pestaña del navegador

### Título principal
```
🤩Bienvenid@s
TE LO VENDO RIOHACHA
```
**Dónde aparece:** Título grande en el centro de la página de inicio

### Ubicación de la tienda
```
📍 TALASHI LOCAL 219
```
**Dónde aparece:** Debajo del título principal (clickeable, abre Google Maps)

### Estado de la tienda (header)
```
Abierto
```
**Dónde aparece:** Esquina superior derecha del header
**Nota:** Cambia a "Cerrado" fuera del horario

### Botón principal
```
Catálogo✅
```
**Dónde aparece:** Botón grande en el centro de la página de inicio

---

## 📦 PÁGINA DE CATÁLOGO (catalogo.html)

### Título de la página (pestaña del navegador)
```
Catálogo - TE LO VENDO RIOHACHA
```
**Dónde aparece:** En la pestaña del navegador

### Banner de horario (dinámico)

**Cuando está ABIERTO:**
```
Icono: 🌟
Texto: ¡Estamos abiertos! Pide ahora y recibe tu pedido hoy mismo.
```
**Dónde aparece:** Banner superior del catálogo cuando la tienda está abierta

**Cuando está CERRADO:**
```
Icono: 🌙
Texto: Estás comprando fuera de nuestro horario. Finaliza tu pedido ahora y serás el primero en la fila para la entrega de mañana.
```
**Dónde aparece:** Banner superior del catálogo cuando la tienda está cerrada

### Estado de la tienda
```
Abierto ahora
```
**Dónde aparece:** Debajo del nombre de la tienda en el header
**Nota:** Cambia automáticamente a "Cerrado" fuera del horario

### Búsqueda
```
Buscar productos...
```
**Dónde aparece:** Placeholder del campo de búsqueda

### Categorías (botones de filtro)
```
Todos
🎧 Audio y Tecnología
💪 Salud y Suplementos
🏠 Hogar y Cocina
✨ Belleza y Cuidado
🎮 Gaming
🏋️‍♂️ Deportes
```
**Dónde aparece:** Botones de categorías debajo de la barra de búsqueda

### Estado de carga
```
Cargando productos...
```
**Dónde aparece:** Mientras se cargan los productos de Google Sheets

### Estado vacío (sin resultados)
```
Icono: 📦
Título: No se encontraron productos
Mensaje: Intenta con otros términos de búsqueda o categoría
Botón: Ver todos los productos
```
**Dónde aparece:** Cuando la búsqueda o filtro no encuentra productos

### Botón agregar al carrito
```
Agregar al Carrito
```
**Dónde aparece:** En cada tarjeta de producto
**Estado exitoso:** `✓ Agregado` (se muestra por 2 segundos después de agregar)

---

## 🛒 CARRITO FLOTANTE

### Contador de productos
```
0 productos
1 producto
X productos
```
**Dónde aparece:** Carrito flotante en la esquina inferior derecha
**Nota:** Cambia dinámicamente según la cantidad

### Botón del carrito
```
Ver Carrito
```
**Dónde aparece:** Botón dentro del carrito flotante

---

## 📋 MODAL DE CONFIRMAR PEDIDO

### Título del modal
```
Confirmar Pedido
```
**Dónde aparece:** Título del modal de checkout

### Sección resumen del pedido
```
Resumen del Pedido
```
**Dónde aparece:** Título de la sección de resumen

### Costos
```
Subtotal:
Domicilio:
Total:
```
**Dónde aparece:** Desglose de precios en el resumen del pedido

### Tipo de entrega
```
Tipo de Entrega
```
**Dónde aparece:** Título de la sección de opciones de entrega

**Opción 1 - Recoger:**
```
Recoger en Local
Sin costo adicional
```

**Opción 2 - Domicilio:**
```
Domicilio
Costo adicional: $5,000
```
**Dónde aparecen:** Opciones de radio para seleccionar tipo de entrega

### Formulario de datos del cliente
```
Datos del Cliente
```
**Dónde aparece:** Título de la sección del formulario

**Campos del formulario:**
```
Nombre completo *
Teléfono *
Dirección completa *
Notas adicionales (opcional)
```
**Dónde aparecen:** Labels de los campos de entrada
**Nota:** "Dirección completa" solo aparece cuando se selecciona "Domicilio"

**Placeholder de dirección:**
```
Calle, número, barrio, referencias...
```

**Placeholder de notas:**
```
Instrucciones especiales, alergias, etc.
```

### Botones del modal
```
Cancelar
Confirmar Pedido
```
**Dónde aparecen:** Botones al final del modal de checkout

**Botón cuando está cerrado:**
```
Programar Mi Pedido
```
**Dónde aparece:** Reemplaza "Confirmar Pedido" cuando la tienda está cerrada

---

## 🔍 MODAL DE PRODUCTO

### Sección de descripción
```
Descripción
```
**Dónde aparece:** Título de la sección de descripción del producto

### Selector de variantes
```
Selecciona una opción
```
**Dónde aparece:** Label del selector de variantes (color, talla, etc.)
**Nota:** La primera opción se selecciona automáticamente

### Control de cantidad
```
Cantidad
```
**Dónde aparece:** Label del selector de cantidad

### Botón agregar
```
Agregar al Carrito
```
**Dónde aparece:** Botón principal del modal de producto
**Estado exitoso:** Fondo verde por 1 segundo

### Garantías
```
↩️ Devolución gratis en 7 días
✅ Garantía de satisfacción
🔒 Compra 100% segura
```
**Dónde aparecen:** Sección de garantías en el modal de producto

### Precio antes (descuento)
```
Antes:
```
**Dónde aparece:** Label antes del precio original tachado (solo si hay descuento)

### Líneas de atención
```
Líneas de Atención
📷 Instagram
💬 WhatsApp 1
💬 WhatsApp 2
💬 WhatsApp 3
```
**Dónde aparecen:** Enlaces de contacto en el modal de producto

### Textos por defecto del modal
```
Nombre del Producto
```
**Dónde aparece:** Título por defecto antes de cargar el producto

```
Descripción del producto
```
**Dónde aparece:** Texto por defecto de descripción antes de cargar

```
$0
```
**Dónde aparece:** Precio por defecto antes de cargar

```
Producto
```
**Dónde aparece:** Alt text de la imagen por defecto

---

## ⚠️ MENSAJES DE ERROR Y ALERTAS

### Notificación de error de Google Sheets

**Título de la notificación:**
```
Problema con Google Sheets
```

**Texto adicional:**
```
Mostrando productos de ejemplo mientras tanto.
```
**Dónde aparece:** Notificación roja en la parte superior cuando hay error de conexión

### Errores específicos de Google Sheets

```
La hoja de Google Sheets no es pública. Cambia los permisos a "Cualquier persona con el enlace puede ver".
```
**Cuándo aparece:** Error 403 al cargar productos

```
La hoja de Google Sheets no existe o el ID es incorrecto.
```
**Cuándo aparece:** Error 404 al cargar productos

```
Problema de permisos CORS. Verifica que la hoja sea pública.
```
**Cuándo aparece:** Error de CORS al cargar productos

```
No se puede conectar a Google Sheets. Verifica tu conexión a internet y que la hoja sea pública.
```
**Cuándo aparece:** Error de conexión al cargar productos

```
No se encontraron productos en Google Sheets
```
**Cuándo aparece:** Cuando el CSV está vacío

```
Google Sheets URL no configurada. Configure GOOGLE_SHEET_URL en STORE_CONFIG.
```
**Cuándo aparece:** Cuando no hay URL configurada

### Alertas de validación del carrito

```
Tu carrito está vacío
```
**Cuándo aparece:** Cuando intentas ver el carrito sin productos

```
Por favor ingresa tu nombre completo
```
**Cuándo aparece:** Al confirmar pedido sin llenar el nombre

```
Por favor ingresa tu número de teléfono
```
**Cuándo aparece:** Al confirmar pedido sin llenar el teléfono

```
Por favor ingresa tu dirección para el domicilio
```
**Cuándo aparece:** Al confirmar pedido con domicilio sin llenar la dirección

```
¡Pedido enviado! Te contactaremos pronto por WhatsApp.
```
**Cuándo aparece:** Después de confirmar exitosamente un pedido

### Confirmaciones de eliminación

```
¿Deseas eliminar este producto del carrito?
```
**Cuándo aparece:** Al intentar eliminar un producto del carrito (mensaje de confirmación)

```
¿Estás seguro de eliminar este producto del carrito?
```
**Cuándo aparece:** Mensaje alternativo de confirmación al eliminar producto

---

## 💬 MENSAJES DE WHATSAPP (Automáticos)

### Mensaje de producto individual
```
Hola, me interesa este producto:
[Nombre del Producto]
Precio: [Precio]
```
**Cuándo se envía:** Al hacer clic en el botón de WhatsApp desde el modal de producto

### Mensaje de pedido completo
```
Hola! Me gustaría hacer el siguiente pedido:

[Lista de productos con cantidades y precios]

Subtotal: $X
Domicilio: $X (o "Sin domicilio")
Total: $X

Datos de entrega:
Tipo: Recoger en local / Domicilio
Nombre: [nombre]
Teléfono: [teléfono]
Dirección: [dirección] (solo si es domicilio)
Notas: [notas] (si las hay)
```
**Cuándo se envía:** Al confirmar un pedido desde el carrito

---

## 🎨 TEMAS (Botón de cambio de tema)

### Modo oscuro
```
Icono: ☀️
```
**Cuándo aparece:** Cuando está en modo oscuro (muestra el sol para cambiar a claro)

### Modo claro
```
Icono: 🌙
```
**Cuándo aparece:** Cuando está en modo claro (muestra la luna para cambiar a oscuro)

---

## ♿ ARIA LABELS (Accesibilidad)

```
Volver al inicio
Cambiar tema
Contactar por WhatsApp
```
**Dónde aparecen:** Labels ocultos para lectores de pantalla en botones sin texto

---

## 📝 NOTAS IMPORTANTES

1. **Textos dinámicos:** Algunos textos cambian según el estado (abierto/cerrado, cantidad de productos, etc.)
2. **Formato de precios:** Todos los precios se muestran con el formato `$X,XXX`
3. **Variantes:** Se muestran entre paréntesis después del nombre: `Producto (Variante)`
4. **Contadores:** Singular/plural se maneja automáticamente (1 producto / 2 productos)

---

## 🔄 INSTRUCCIONES PARA ACTUALIZAR

Cuando modifiques este archivo:
1. Cambia SOLO los textos que quieras actualizar
2. NO cambies la estructura ni los comentarios **Dónde aparece:**
3. Guarda el archivo
4. Dime: "Actualiza los textos del sistema"
5. Yo leeré este archivo y actualizaré el código automáticamente

---

**Última actualización:** 2025-10-19
**Proyecto:** TE LO VENDO RIOHACHA - Catálogo Digital
