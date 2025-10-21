/**
 * SISTEMA DE GESTIÓN DE PRODUCTOS - TE LO VENDO RIOHACHA (OPTIMIZADO)
 * Google Apps Script para gestión rápida de productos
 * Versión: 2.0 - OPTIMIZADA PARA ALTO RENDIMIENTO
 * Autor: Claude Code
 * Fecha: 2025-10-19
 *
 * ORDEN DE COLUMNAS:
 * 1=ID, 2=NombreProducto, 3=Descripcion, 4=Variantes,
 * 5=PrecioOriginal, 6=PrecioFinal, 7=URL_Imagen, 8=Categoria, 9=Visible
 *
 * OPTIMIZACIONES:
 * - Caché de categorías (no lee del servidor cada vez)
 * - Lectura en bloque de datos
 * - Reducción de llamadas al servidor
 * - Mejor rendimiento con 400+ productos
 */

// ==================== CACHÉ GLOBAL ====================
var CACHE = {
  categorias: null,
  ultimaActualizacion: null
};

// ==================== MENÚ PERSONALIZADO ====================

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📦 PRODUCTOS')
    .addItem('➕ Agregar Nuevo Producto', 'abrirPanelAgregar')
    .addItem('✏️ Editar Producto Seleccionado', 'abrirPanelEditar')
    .addSeparator()
    .addItem('👁️ Alternar Visibilidad', 'alternarVisibilidad')
    .addItem('🔄 Duplicar Producto', 'duplicarProducto')
    .addSeparator()
    .addItem('🗑️ Eliminar Producto', 'eliminarProducto')
    .addSeparator()
    .addItem('🔍 Buscar Producto', 'abrirBusqueda')
    .addItem('📊 Ver Estadísticas', 'mostrarEstadisticas')
    .addSeparator()
    .addItem('🔄 Limpiar Caché', 'limpiarCache')
    .addToUi();
}

// ==================== FUNCIONES DEL PANEL LATERAL ====================

function abrirPanelAgregar() {
  const html = HtmlService.createHtmlOutputFromFile('PanelProductos')
    .setTitle('➕ Agregar Producto')
    .setWidth(350);
  SpreadsheetApp.getUi().showSidebar(html);
}

function abrirPanelEditar() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const fila = sheet.getActiveCell().getRow();

  if (fila === 1) {
    SpreadsheetApp.getUi().alert('❌ Error', 'Por favor selecciona un producto para editar.', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }

  const html = HtmlService.createHtmlOutputFromFile('PanelProductos')
    .setTitle('✏️ Editar Producto')
    .setWidth(350);
  SpreadsheetApp.getUi().showSidebar(html);
}

function abrirBusqueda() {
  const html = HtmlService.createHtmlOutputFromFile('PanelBusqueda')
    .setTitle('🔍 Buscar Producto')
    .setWidth(350);
  SpreadsheetApp.getUi().showSidebar(html);
}

// ==================== FUNCIONES DE CACHÉ ====================

/**
 * Limpia el caché manualmente
 */
function limpiarCache() {
  CACHE.categorias = null;
  CACHE.ultimaActualizacion = null;
  SpreadsheetApp.getUi().alert('✅ Caché limpiado', 'El caché ha sido limpiado exitosamente.', SpreadsheetApp.getUi().ButtonSet.OK);
}

// ==================== FUNCIONES DE DATOS OPTIMIZADAS ====================

/**
 * Obtiene el siguiente ID disponible (OPTIMIZADO)
 */
function obtenerSiguienteID() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const ultimaFila = sheet.getLastRow();

  if (ultimaFila === 1) {
    return 1;
  }

  // Solo lee la última celda, no toda la columna
  const ultimoID = sheet.getRange(ultimaFila, 1).getValue();
  return parseInt(ultimoID) + 1;
}

/**
 * Obtiene los datos del producto en la fila seleccionada (OPTIMIZADO)
 */
function obtenerProductoSeleccionado() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const fila = sheet.getActiveCell().getRow();

  if (fila === 1) {
    return null;
  }

  // Lee solo la fila necesaria, no toda la hoja
  const datos = sheet.getRange(fila, 1, 1, 9).getValues()[0];

  return {
    fila: fila,
    id: datos[0],
    nombre: datos[1],
    descripcion: datos[2],
    variantes: datos[3],
    precioOriginal: datos[4],
    precioFinal: datos[5],
    imagenURL: datos[6],
    categoria: datos[7],
    visible: datos[8]
  };
}

/**
 * Obtiene la lista de categorías únicas (OPTIMIZADO CON CACHÉ)
 */
function obtenerCategorias() {
  // Si tenemos caché válido (menos de 5 minutos), usarlo
  const ahora = new Date().getTime();
  if (CACHE.categorias && CACHE.ultimaActualizacion) {
    const tiempoTranscurrido = ahora - CACHE.ultimaActualizacion;
    if (tiempoTranscurrido < 300000) { // 5 minutos = 300000 ms
      return CACHE.categorias;
    }
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const ultimaFila = sheet.getLastRow();

  // Categorías por defecto si la hoja está vacía
  if (ultimaFila === 1) {
    const categoriasDefault = [
      'Audio y Tecnología',
      'Salud y Suplementos',
      'Hogar y Cocina',
      'Belleza y Cuidado Personal',
      'Gaming y Entretenimiento',
      'Deportes y Fitness'
    ];

    // Guardar en caché
    CACHE.categorias = categoriasDefault;
    CACHE.ultimaActualizacion = ahora;

    return categoriasDefault;
  }

  // Leer todas las categorías de una vez (más rápido que una por una)
  const categorias = sheet.getRange(2, 8, ultimaFila - 1, 1).getValues();
  const categoriasUnicas = [...new Set(
    categorias
      .map(cat => cat[0])
      .filter(cat => cat !== '' && cat !== null && cat !== undefined)
  )].sort();

  // Guardar en caché
  CACHE.categorias = categoriasUnicas.length > 0 ? categoriasUnicas : [
    'Audio y Tecnología',
    'Salud y Suplementos',
    'Hogar y Cocina',
    'Belleza y Cuidado Personal',
    'Gaming y Entretenimiento',
    'Deportes y Fitness'
  ];
  CACHE.ultimaActualizacion = ahora;

  return CACHE.categorias;
}

// ==================== AGREGAR PRODUCTO (OPTIMIZADO) ====================

function agregarProducto(producto) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const siguienteID = obtenerSiguienteID();

    if (!producto.nombre || !producto.precioFinal) {
      throw new Error('El nombre y el precio final son obligatorios');
    }

    // Preparar datos
    const nuevaFila = [
      siguienteID,
      producto.nombre,
      producto.descripcion || '',
      producto.variantes || '',
      producto.precioOriginal || '',
      parseInt(producto.precioFinal),
      producto.imagenURL || '',
      producto.categoria || '',
      producto.visible || 'SI'
    ];

    // Insertar fila
    sheet.appendRow(nuevaFila);
    const ultimaFila = sheet.getLastRow();

    // Formatear de forma optimizada
    formatearFilaProductoOptimizado(sheet, ultimaFila);

    // Invalidar caché de categorías si se agregó una nueva
    if (producto.categoria && producto.categoria.trim() !== '') {
      CACHE.categorias = null;
    }

    return {
      exito: true,
      mensaje: '✅ Producto agregado exitosamente',
      id: siguienteID
    };

  } catch (error) {
    return {
      exito: false,
      mensaje: '❌ Error: ' + error.message
    };
  }
}

// ==================== EDITAR PRODUCTO (OPTIMIZADO) ====================

function editarProducto(fila, producto) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    if (fila <= 1 || fila > sheet.getLastRow()) {
      throw new Error('Fila inválida');
    }

    if (!producto.nombre || !producto.precioFinal) {
      throw new Error('El nombre y el precio final son obligatorios');
    }

    // Actualizar datos
    const datosActualizados = [
      sheet.getRange(fila, 1).getValue(), // Mantener ID original
      producto.nombre,
      producto.descripcion || '',
      producto.variantes || '',
      producto.precioOriginal || '',
      parseInt(producto.precioFinal),
      producto.imagenURL || '',
      producto.categoria || '',
      producto.visible || 'SI'
    ];

    // Actualizar en una sola operación (más rápido)
    sheet.getRange(fila, 1, 1, 9).setValues([datosActualizados]);
    formatearFilaProductoOptimizado(sheet, fila);

    // Invalidar caché de categorías
    CACHE.categorias = null;

    return {
      exito: true,
      mensaje: '✅ Producto actualizado exitosamente'
    };

  } catch (error) {
    return {
      exito: false,
      mensaje: '❌ Error: ' + error.message
    };
  }
}

// ==================== ALTERNAR VISIBILIDAD (OPTIMIZADO) ====================

function alternarVisibilidad() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const fila = sheet.getActiveCell().getRow();

  if (fila === 1) {
    SpreadsheetApp.getUi().alert('❌ Error', 'Por favor selecciona un producto.', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }

  const celdaVisible = sheet.getRange(fila, 9);
  const valorActual = celdaVisible.getValue();
  const nuevoValor = (valorActual === 'SI') ? 'NO' : 'SI';

  // Actualizar valor y color en una sola operación
  const rango = sheet.getRange(fila, 1, 1, 9);
  celdaVisible.setValue(nuevoValor);
  rango.setBackground(nuevoValor === 'NO' ? '#ffcccc' : '#ffffff');

  SpreadsheetApp.getUi().alert('✅ Visibilidad cambiada a: ' + nuevoValor);
}

// ==================== DUPLICAR PRODUCTO (OPTIMIZADO) ====================

function duplicarProducto() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const fila = sheet.getActiveCell().getRow();

  if (fila === 1) {
    SpreadsheetApp.getUi().alert('❌ Error', 'Por favor selecciona un producto para duplicar.', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }

  const ui = SpreadsheetApp.getUi();
  const respuesta = ui.alert('🔄 Duplicar Producto', '¿Estás seguro de duplicar este producto?', ui.ButtonSet.YES_NO);

  if (respuesta !== ui.Button.YES) {
    return;
  }

  // Leer datos y crear nueva fila en una operación
  const datos = sheet.getRange(fila, 1, 1, 9).getValues()[0];
  const siguienteID = obtenerSiguienteID();

  const nuevaFila = [
    siguienteID,
    datos[1] + ' (Copia)',
    datos[2],
    datos[3],
    datos[4],
    datos[5],
    datos[6],
    datos[7],
    datos[8]
  ];

  sheet.appendRow(nuevaFila);
  const ultimaFila = sheet.getLastRow();
  formatearFilaProductoOptimizado(sheet, ultimaFila);

  SpreadsheetApp.getUi().alert('✅ Producto duplicado exitosamente con ID: ' + siguienteID);
}

// ==================== ELIMINAR PRODUCTO ====================

function eliminarProducto() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const fila = sheet.getActiveCell().getRow();

  if (fila === 1) {
    SpreadsheetApp.getUi().alert('❌ Error', 'Por favor selecciona un producto para eliminar.', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }

  const ui = SpreadsheetApp.getUi();
  const nombreProducto = sheet.getRange(fila, 2).getValue();
  const respuesta = ui.alert(
    '⚠️ Confirmar Eliminación',
    '¿Estás seguro de eliminar el producto "' + nombreProducto + '"?\n\nEsta acción no se puede deshacer.',
    ui.ButtonSet.YES_NO
  );

  if (respuesta === ui.Button.YES) {
    sheet.deleteRow(fila);
    CACHE.categorias = null; // Invalidar caché
    SpreadsheetApp.getUi().alert('✅ Producto eliminado exitosamente');
  }
}

// ==================== BUSCAR PRODUCTO (OPTIMIZADO) ====================

/**
 * Búsqueda optimizada que lee todos los datos de una vez
 */
function buscarProductos(termino) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const ultimaFila = sheet.getLastRow();

  if (ultimaFila === 1) {
    return [];
  }

  // Leer TODOS los datos de una sola vez (mucho más rápido)
  const datos = sheet.getRange(2, 1, ultimaFila - 1, 9).getValues();
  const terminoBusqueda = termino.toLowerCase();

  // Filtrar en memoria (súper rápido)
  const resultados = datos
    .map((fila, index) => ({
      fila: index + 2,
      id: fila[0],
      nombre: fila[1],
      descripcion: fila[2],
      precio: fila[5],
      categoria: fila[7],
      visible: fila[8]
    }))
    .filter(producto => {
      const nombreMatch = String(producto.nombre).toLowerCase().includes(terminoBusqueda);
      const descripcionMatch = String(producto.descripcion).toLowerCase().includes(terminoBusqueda);
      return nombreMatch || descripcionMatch;
    })
    .slice(0, 50); // Limitar a 50 resultados para mejor rendimiento

  return resultados;
}

function seleccionarFila(fila) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.setActiveRange(sheet.getRange(fila, 1));
}

// ==================== ESTADÍSTICAS (OPTIMIZADO) ====================

function mostrarEstadisticas() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const ultimaFila = sheet.getLastRow();

  if (ultimaFila === 1) {
    SpreadsheetApp.getUi().alert('📊 Estadísticas', 'No hay productos registrados.', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }

  // Leer todos los datos de una vez
  const datos = sheet.getRange(2, 1, ultimaFila - 1, 9).getValues();

  const totalProductos = datos.length;
  const productosVisibles = datos.filter(fila => fila[8] === 'SI').length;
  const productosOcultos = totalProductos - productosVisibles;

  // Contar categorías
  const categorias = {};
  datos.forEach(fila => {
    const cat = fila[7] || 'Sin categoría';
    categorias[cat] = (categorias[cat] || 0) + 1;
  });

  const categoriasMayor = Object.entries(categorias)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat, count]) => `  • ${cat}: ${count} productos`)
    .join('\n');

  const mensaje = `
📊 ESTADÍSTICAS DE PRODUCTOS

Total de productos: ${totalProductos}
  • Visibles: ${productosVisibles} ✅
  • Ocultos: ${productosOcultos} 👁️

Top 3 Categorías:
${categoriasMayor}
  `;

  SpreadsheetApp.getUi().alert('📊 Estadísticas', mensaje, SpreadsheetApp.getUi().ButtonSet.OK);
}

// ==================== FORMATO OPTIMIZADO ====================

/**
 * Formatea una fila de producto (VERSIÓN OPTIMIZADA)
 */
function formatearFilaProductoOptimizado(sheet, fila) {
  const rango = sheet.getRange(fila, 1, 1, 9);

  // Aplicar todos los formatos de una vez (batch operation)
  rango.setBorder(true, true, true, true, true, true);

  // Alineaciones
  sheet.getRange(fila, 1).setHorizontalAlignment('center');
  sheet.getRange(fila, 5).setHorizontalAlignment('right');
  sheet.getRange(fila, 6).setHorizontalAlignment('right');

  // Formato de número solo si es necesario
  const precioOriginal = sheet.getRange(fila, 5).getValue();
  const precioFinal = sheet.getRange(fila, 6).getValue();

  if (typeof precioOriginal === 'number' && precioOriginal > 0) {
    sheet.getRange(fila, 5).setNumberFormat('#,##0');
  }

  if (typeof precioFinal === 'number' && precioFinal > 0) {
    sheet.getRange(fila, 6).setNumberFormat('#,##0');
  }

  // Color de fondo
  const visible = sheet.getRange(fila, 9).getValue();
  rango.setBackground(visible === 'NO' ? '#ffcccc' : '#ffffff');
}
