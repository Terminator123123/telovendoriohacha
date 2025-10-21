# 🚀 Guía de Instalación - Sistema de Gestión de Productos

## 📋 Tabla de Contenidos
1. [Requisitos Previos](#requisitos-previos)
2. [Instalación Paso a Paso](#instalación-paso-a-paso)
3. [Configuración Inicial](#configuración-inicial)
4. [Cómo Usar el Sistema](#cómo-usar-el-sistema)
5. [Solución de Problemas](#solución-de-problemas)

---

## ✅ Requisitos Previos

- Tener acceso a tu hoja de Google Sheets con los productos
- La hoja debe tener estos encabezados en la primera fila:

```
ID | NombreProducto | Descripcion | PrecioOriginal | PrecioFinal | Categoria | ImagenURL | Variantes | Visible
```

---

## 🔧 Instalación Paso a Paso

### **Paso 1: Abrir el Editor de Apps Script**

1. Abre tu hoja de Google Sheets con los productos
2. En el menú superior, ve a: **Extensiones** → **Apps Script**

   ![Menú](https://via.placeholder.com/600x100/044A76/FFFFFF?text=Extensiones+%E2%86%92+Apps+Script)

3. Se abrirá una nueva pestaña con el editor de código

---

### **Paso 2: Crear el Archivo Principal (Code.gs)**

1. En el editor de Apps Script, verás un archivo llamado `Code.gs`
2. **BORRA todo el contenido** que aparece por defecto
3. Abre el archivo `Code.gs` que te proporcioné
4. **Copia TODO el contenido** del archivo `Code.gs`
5. **Pega** el contenido en el editor de Apps Script
6. Haz clic en el icono de **💾 Guardar** (o presiona `Ctrl + S`)

   ```
   ✅ Archivo Code.gs creado correctamente
   ```

---

### **Paso 3: Crear el Panel de Productos (PanelProductos.html)**

1. En el editor de Apps Script, haz clic en el botón **➕** (al lado de "Archivos")
2. Selecciona **HTML**
3. Nómbralo exactamente: `PanelProductos` (sin espacios, sin .html)
4. Haz clic en **Aceptar**
5. **Borra** el contenido por defecto del archivo HTML
6. Abre el archivo `PanelProductos.html` que te proporcioné
7. **Copia TODO el contenido**
8. **Pega** en el nuevo archivo HTML que creaste
9. Haz clic en **💾 Guardar**

   ```
   ✅ Archivo PanelProductos.html creado correctamente
   ```

---

### **Paso 4: Crear el Panel de Búsqueda (PanelBusqueda.html)**

1. Repite el proceso anterior:
2. Haz clic en **➕** → **HTML**
3. Nómbralo exactamente: `PanelBusqueda`
4. **Borra** el contenido por defecto
5. Abre el archivo `PanelBusqueda.html` que te proporcioné
6. **Copia TODO el contenido**
7. **Pega** en el nuevo archivo
8. Haz clic en **💾 Guardar**

   ```
   ✅ Archivo PanelBusqueda.html creado correctamente
   ```

---

### **Paso 5: Verificar la Estructura de Archivos**

Debes tener exactamente **3 archivos** en el editor:

```
📁 Apps Script Project
  ├─ 📄 Code.gs
  ├─ 📄 PanelProductos.html
  └─ 📄 PanelBusqueda.html
```

---

### **Paso 6: Ejecutar por Primera Vez (Autorización)**

1. En el menú del editor, selecciona la función: **onOpen**
2. Haz clic en el botón **▶ Ejecutar**

   ![Ejecutar](https://via.placeholder.com/600x100/10B981/FFFFFF?text=%E2%96%B6+Ejecutar+funci%C3%B3n+onOpen)

3. Aparecerá un mensaje: **"Autorización necesaria"**
4. Haz clic en **Revisar permisos**
5. Selecciona tu cuenta de Google
6. Haz clic en **Avanzado** (abajo a la izquierda)
7. Haz clic en **Ir a [nombre del proyecto] (no seguro)**
8. Haz clic en **Permitir**

   ```
   ✅ Script autorizado correctamente
   ```

---

### **Paso 7: Regresar a tu Hoja de Google Sheets**

1. Cierra la pestaña del editor de Apps Script
2. Regresa a tu hoja de Google Sheets
3. **Recarga la página** (presiona F5 o Ctrl + R)

   ```
   ⏳ Espera unos segundos...
   ```

4. Deberías ver un **nuevo menú** en la barra superior:

   ```
   📦 PRODUCTOS
   ```

---

## 🎉 ¡Instalación Completada!

Si ves el menú **📦 PRODUCTOS** en la barra superior, ¡todo está listo!

---

## ⚙️ Configuración Inicial

### **Verificar Encabezados de la Hoja**

Tu primera fila **DEBE** tener exactamente estos encabezados:

| A  | B                | C            | D               | E            | F          | G          | H          | I       |
|----|------------------|--------------|-----------------|--------------|------------|------------|------------|---------|
| ID | NombreProducto   | Descripcion  | PrecioOriginal  | PrecioFinal  | Categoria  | ImagenURL  | Variantes  | Visible |

**Importante:**
- Los nombres deben estar **EXACTAMENTE** como se muestran (con mayúsculas y minúsculas)
- No debe haber espacios extra
- No debe haber tildes ni caracteres especiales

---

## 📘 Cómo Usar el Sistema

### **Menú Principal: 📦 PRODUCTOS**

Cuando hagas clic en el menú **📦 PRODUCTOS**, verás estas opciones:

```
📦 PRODUCTOS
  ├─ ➕ Agregar Nuevo Producto
  ├─ ✏️ Editar Producto Seleccionado
  ├─ ─────────────────────
  ├─ 👁️ Alternar Visibilidad
  ├─ 🔄 Duplicar Producto
  ├─ ─────────────────────
  ├─ 🗑️ Eliminar Producto
  ├─ ─────────────────────
  ├─ 🔍 Buscar Producto
  └─ 📊 Ver Estadísticas
```

---

### **1. ➕ Agregar Nuevo Producto**

**Cómo hacerlo:**

1. Haz clic en **📦 PRODUCTOS** → **➕ Agregar Nuevo Producto**
2. Se abrirá un **panel lateral** a la derecha
3. Llena los campos del formulario:

   **Campos obligatorios (*):**
   - ✅ **Nombre del Producto**: Nombre descriptivo
   - ✅ **Precio Final**: Precio de venta actual

   **Campos opcionales:**
   - Descripción (máximo 300 caracteres)
   - Precio Original (si hay descuento)
   - Categoría (selecciona de la lista)
   - URL de la Imagen (se mostrará vista previa)
   - Variantes (separadas por comas, ej: "Rojo, Azul, Verde")
   - Visible (SI/NO)

4. Haz clic en **➕ Agregar Producto**
5. Verás el mensaje: **"✅ Producto agregado exitosamente"**
6. El producto se agregará **automáticamente** con el siguiente ID disponible
7. Los campos se **limpian automáticamente** para agregar otro producto

**Ventajas:**
- ✅ No necesitas ir al final de la tabla
- ✅ No necesitas calcular el siguiente ID
- ✅ Validación automática de campos
- ✅ Vista previa de la imagen
- ✅ Contador de caracteres en la descripción

---

### **2. ✏️ Editar Producto Seleccionado**

**Cómo hacerlo:**

1. **Selecciona cualquier celda** de la fila del producto que quieres editar
2. Haz clic en **📦 PRODUCTOS** → **✏️ Editar Producto Seleccionado**
3. Se abrirá el panel lateral con los **datos actuales** del producto
4. Modifica lo que necesites
5. Haz clic en **💾 Guardar Cambios**
6. Verás el mensaje: **"✅ Producto actualizado exitosamente"**

**Nota:** El ID del producto **NO** se puede cambiar (se mantiene el original)

---

### **3. 👁️ Alternar Visibilidad**

**Cómo hacerlo:**

1. **Selecciona** la fila del producto
2. Haz clic en **📦 PRODUCTOS** → **👁️ Alternar Visibilidad**
3. El campo "Visible" cambiará automáticamente:
   - **SI** → **NO** (producto se oculta en el catálogo)
   - **NO** → **SI** (producto se muestra en el catálogo)
4. La fila cambiará de color:
   - **Blanco**: Producto visible ✅
   - **Rojo claro**: Producto oculto 👁️

**Uso rápido:** Ideal para ocultar productos temporalmente sin eliminarlos.

---

### **4. 🔄 Duplicar Producto**

**Cómo hacerlo:**

1. **Selecciona** la fila del producto a duplicar
2. Haz clic en **📦 PRODUCTOS** → **🔄 Duplicar Producto**
3. Confirma la acción
4. Se creará una **copia exacta** del producto con:
   - Nuevo ID (auto-generado)
   - Mismo nombre + " (Copia)"
   - Mismos datos (precio, descripción, etc.)

**Uso rápido:** Útil para crear variaciones de un producto existente.

---

### **5. 🗑️ Eliminar Producto**

**Cómo hacerlo:**

1. **Selecciona** la fila del producto a eliminar
2. Haz clic en **📦 PRODUCTOS** → **🗑️ Eliminar Producto**
3. Confirma la eliminación
4. La fila se eliminará **permanentemente**

**⚠️ ADVERTENCIA:** Esta acción **NO se puede deshacer**. Usa con precaución.

---

### **6. 🔍 Buscar Producto**

**Cómo hacerlo:**

1. Haz clic en **📦 PRODUCTOS** → **🔍 Buscar Producto**
2. Se abrirá un panel lateral con un **campo de búsqueda**
3. Escribe el nombre o descripción del producto
4. Los resultados aparecerán **en tiempo real** (después de 2 caracteres)
5. Haz clic en cualquier resultado para **seleccionar ese producto** en la hoja

**Características:**
- ✅ Búsqueda en tiempo real
- ✅ Busca en nombre y descripción
- ✅ Muestra: ID, nombre, categoría, precio, visibilidad
- ✅ Un clic para ir al producto

---

### **7. 📊 Ver Estadísticas**

**Cómo hacerlo:**

1. Haz clic en **📦 PRODUCTOS** → **📊 Ver Estadísticas**
2. Verás un resumen con:
   - Total de productos
   - Productos visibles
   - Productos ocultos
   - Top 3 categorías con más productos

**Ejemplo de salida:**

```
📊 ESTADÍSTICAS DE PRODUCTOS

Total de productos: 45
  • Visibles: 42 ✅
  • Ocultos: 3 👁️

Top 3 Categorías:
  • Audio y Tecnología: 15 productos
  • Hogar y Cocina: 12 productos
  • Belleza y Cuidado Personal: 10 productos
```

---

## 🎯 Flujo de Trabajo Recomendado

### **Para agregar muchos productos nuevos:**

1. Abre **📦 PRODUCTOS** → **➕ Agregar Nuevo Producto**
2. Llena el formulario del primer producto
3. Haz clic en **➕ Agregar Producto**
4. Los campos se limpian automáticamente
5. Llena el siguiente producto
6. Repite el proceso

**Tiempo estimado:** 1-2 minutos por producto

---

### **Para actualizar precios masivamente:**

1. Usa **🔍 Buscar Producto** para encontrar el producto
2. Haz clic en el resultado para seleccionarlo
3. Usa **✏️ Editar Producto Seleccionado**
4. Cambia el precio
5. Guarda

---

### **Para ocultar productos fuera de temporada:**

1. Selecciona el producto
2. Usa **👁️ Alternar Visibilidad**
3. Repite para cada producto

**Ventaja:** No pierdes los datos, solo se ocultan del catálogo.

---

## 🔧 Solución de Problemas

### **Problema 1: No veo el menú "📦 PRODUCTOS"**

**Soluciones:**

1. **Recarga la página** (F5 o Ctrl + R)
2. Verifica que los archivos estén correctamente instalados
3. Ve a **Extensiones** → **Apps Script** y ejecuta la función `onOpen` manualmente
4. Cierra y vuelve a abrir la hoja de Google Sheets

---

### **Problema 2: "Error de autorización"**

**Solución:**

1. Ve a **Extensiones** → **Apps Script**
2. Ejecuta la función `onOpen`
3. Autoriza los permisos cuando se solicite
4. Regresa a la hoja y recarga

---

### **Problema 3: El panel lateral no se abre**

**Solución:**

1. Verifica que los archivos HTML tengan exactamente estos nombres:
   - `PanelProductos`
   - `PanelBusqueda`
2. Asegúrate de que no haya errores en el código (revisa la consola de Apps Script)

---

### **Problema 4: "El producto no se agrega"**

**Verificar:**

1. ¿Llenaste los campos obligatorios? (Nombre y Precio Final)
2. ¿El precio es un número válido?
3. ¿La primera fila tiene los encabezados correctos?

---

### **Problema 5: Los encabezados no coinciden**

**Solución:**

Tu primera fila DEBE tener exactamente:

```
ID | NombreProducto | Descripcion | PrecioOriginal | PrecioFinal | Categoria | ImagenURL | Variantes | Visible
```

- Copia y pega estos encabezados
- NO cambies las mayúsculas/minúsculas
- NO agregues espacios

---

## 💡 Consejos y Buenas Prácticas

### **1. Categorías consistentes**

Usa siempre las mismas categorías para evitar duplicados:
- ✅ "Audio y Tecnología"
- ❌ "audio y tecnología"
- ❌ "Audio y Tecnologia"

---

### **2. URLs de imágenes**

- Usa servicios como **ImgBB** o **Imgur**
- Asegúrate de que las URLs empiecen con `https://`
- Verifica la vista previa antes de guardar

---

### **3. Variantes**

Separa siempre con comas:
- ✅ "Rojo, Azul, Verde"
- ❌ "Rojo Azul Verde"

---

### **4. Descripciones**

- Máximo 300 caracteres
- El sistema truncará automáticamente a 80 caracteres en el catálogo
- Usa descripciones claras y concisas

---

### **5. Respaldo regular**

Haz copias de seguridad de tu hoja periódicamente:
- **Archivo** → **Hacer una copia**

---

## 📞 Soporte

Si tienes problemas con la instalación o uso del sistema:

1. Revisa esta guía completamente
2. Verifica la sección de **Solución de Problemas**
3. Asegúrate de que los nombres de archivos sean exactos
4. Verifica los permisos de Apps Script

---

## 🎓 Video Tutorial (Próximamente)

Estoy preparando un video paso a paso para que veas todo el proceso de instalación.

---

## ✅ Checklist de Instalación

Marca cada paso cuando lo completes:

- [ ] ✅ Abrí el editor de Apps Script
- [ ] ✅ Creé el archivo `Code.gs` con el código
- [ ] ✅ Creé el archivo `PanelProductos.html`
- [ ] ✅ Creé el archivo `PanelBusqueda.html`
- [ ] ✅ Ejecuté la función `onOpen` y autoricé los permisos
- [ ] ✅ Recargué la hoja de Google Sheets
- [ ] ✅ Veo el menú **📦 PRODUCTOS** en la barra superior
- [ ] ✅ Probé agregar un producto de prueba
- [ ] ✅ El producto se agregó correctamente

---

**¡Felicidades! 🎉 Ya puedes gestionar tus productos de forma rápida y eficiente.**

---

**Creado por:** Claude Code
**Fecha:** 2025-10-19
**Proyecto:** TE LO VENDO RIOHACHA - Sistema de Gestión de Productos
**Versión:** 1.0
