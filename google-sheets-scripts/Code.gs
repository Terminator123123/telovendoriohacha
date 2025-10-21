/**
 * SISTEMA DE GESTIÓN DE PRODUCTOS - TE LO VENDO RIOHACHA
 * Google Apps Script para gestión rápida de productos
 * Autor: Claude Code
 * Fecha: 2025-10-19
 */

// ==================== MENÚ PERSONALIZADO ====================

/**
 * Crea el menú personalizado cuando se abre la hoja
 */
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
    .addToUi();
}

// ==================== FUNCIONES DEL PANEL LATERAL ====================

/**
 * Abre el panel lateral para agregar producto
 */
function abrirPanelAgregar() {
  const html = HtmlService.createHtmlOutputFromFile('PanelProductos')
    .setTitle('➕ Agregar Producto')
    .setWidth(350);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Abre el panel lateral para editar producto
 */
function abrirPanelEditar() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const fila = sheet.getActiveCell().getRow();

  // Verificar que no sea la fila de encabezados
  if (fila === 1) {
    SpreadsheetApp.getUi().alert('❌ Error', 'Por favor selecciona un producto para editar.', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }

  const html = HtmlService.createHtmlOutputFromFile('PanelProductos')
    .setTitle('✏️ Editar Producto')
    .setWidth(350);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Abre panel de búsqueda
 */
function abrirBusqueda() {
  const html = HtmlService.createHtmlOutputFromFile('PanelBusqueda')
    .setTitle('🔍 Buscar Producto')
    .setWidth(350);
  SpreadsheetApp.getUi().showSidebar(html);
}

// ==================== FUNCIONES DE DATOS ====================

/**
 * Obtiene el siguiente ID disponible
 */
function obtenerSiguienteID() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const ultimaFila = sheet.getLastRow();

  if (ultimaFila === 1) {
    return 1; // Primera fila de datos
  }

  const ultimoID = sheet.getRange(ultimaFila, 1).getValue();
  return parseInt(ultimoID) + 1;
}

/**
 * Obtiene los datos del producto en la fila seleccionada
 */
function obtenerProductoSeleccionado() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const fila = sheet.getActiveCell().getRow();

  if (fila === 1) {
    return null; // Es la fila de encabezados
  }

  const datos = sheet.getRange(fila, 1, 1, 9).getValues()[0];

  return {
    fila: fila,
    id: datos[0],
    nombre: datos[1],
    descripcion: datos[2],
    precioOriginal: datos[3],
    precioFinal: datos[4],
    categoria: datos[5],
    imagenURL: datos[6],
    variantes: datos[7],
    visible: datos[8]
  };
}

/**
 * Obtiene la lista de categorías únicas
 */
function obtenerCategorias() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const ultimaFila = sheet.getLastRow();

  if (ultimaFila === 1) {
    return ['Audio y Tecnología', 'Salud y Suplementos', 'Hogar y Cocina', 'Belleza y Cuidado Personal', 'Gaming y Entretenimiento', 'Deportes y Fitness'];
  }

  const categorias = sheet.getRange(2, 6, ultimaFila - 1, 1).getValues();
  const categoriasUnicas = [...new Set(categorias.map(cat => cat[0]).filter(cat => cat !== ''))];

  return categoriasUnicas.sort();
}

// ==================== AGREGAR PRODUCTO ====================

/**
 * Agrega un nuevo producto a la hoja
 */
function agregarProducto(producto) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const siguienteID = obtenerSiguienteID();

    // Validar campos obligatorios
    if (!producto.nombre || !producto.precioFinal) {
      throw new Error('El nombre y el precio final son obligatorios');
    }

    // Preparar datos
    const nuevaFila = [
      siguienteID,
      producto.nombre,
      producto.descripcion || '',
      producto.precioOriginal || '',
      parseInt(producto.precioFinal),
      producto.categoria || '',
      producto.imagenURL || '',
      producto.variantes || '',
      producto.visible || 'SI'
    ];

    // Insertar en la siguiente fila
    sheet.appendRow(nuevaFila);

    // Formatear la fila nueva
    const ultimaFila = sheet.getLastRow();
    formatearFilaProducto(sheet, ultimaFila);

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

// ==================== EDITAR PRODUCTO ====================

/**
 * Actualiza un producto existente
 */
function editarProducto(fila, producto) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Validar que la fila sea válida
    if (fila <= 1 || fila > sheet.getLastRow()) {
      throw new Error('Fila inválida');
    }

    // Validar campos obligatorios
    if (!producto.nombre || !producto.precioFinal) {
      throw new Error('El nombre y el precio final son obligatorios');
    }

    // Actualizar datos (manteniendo el ID original)
    const datosActualizados = [
      sheet.getRange(fila, 1).getValue(), // Mantener ID original
      producto.nombre,
      producto.descripcion || '',
      producto.precioOriginal || '',
      parseInt(producto.precioFinal),
      producto.categoria || '',
      producto.imagenURL || '',
      producto.variantes || '',
      producto.visible || 'SI'
    ];

    sheet.getRange(fila, 1, 1, 9).setValues([datosActualizados]);
    formatearFilaProducto(sheet, fila);

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

// ==================== ALTERNAR VISIBILIDAD ====================

/**
 * Cambia la visibilidad del producto seleccionado
 */
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

  celdaVisible.setValue(nuevoValor);

  // Cambiar color de fondo para indicar estado
  if (nuevoValor === 'NO') {
    sheet.getRange(fila, 1, 1, 9).setBackground('#ffcccc'); // Rojo claro
  } else {
    sheet.getRange(fila, 1, 1, 9).setBackground('#ffffff'); // Blanco
  }

  SpreadsheetApp.getUi().alert('✅ Visibilidad cambiada a: ' + nuevoValor);
}

// ==================== DUPLICAR PRODUCTO ====================

/**
 * Duplica el producto seleccionado
 */
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

  // Obtener datos del producto
  const datos = sheet.getRange(fila, 1, 1, 9).getValues()[0];
  const siguienteID = obtenerSiguienteID();

  // Crear nueva fila con nuevo ID
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
  formatearFilaProducto(sheet, ultimaFila);

  SpreadsheetApp.getUi().alert('✅ Producto duplicado exitosamente con ID: ' + siguienteID);
}

// ==================== ELIMINAR PRODUCTO ====================

/**
 * Elimina el producto seleccionado
 */
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
    SpreadsheetApp.getUi().alert('✅ Producto eliminado exitosamente');
  }
}

// ==================== BUSCAR PRODUCTO ====================

/**
 * Busca productos por nombre o descripción
 */
function buscarProductos(termino) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const ultimaFila = sheet.getLastRow();

  if (ultimaFila === 1) {
    return [];
  }

  const datos = sheet.getRange(2, 1, ultimaFila - 1, 9).getValues();
  const terminoBusqueda = termino.toLowerCase();

  const resultados = datos
    .map((fila, index) => ({
      fila: index + 2,
      id: fila[0],
      nombre: fila[1],
      descripcion: fila[2],
      precio: fila[4],
      categoria: fila[5],
      visible: fila[8]
    }))
    .filter(producto =>
      producto.nombre.toLowerCase().includes(terminoBusqueda) ||
      producto.descripcion.toLowerCase().includes(terminoBusqueda)
    );

  return resultados;
}

/**
 * Selecciona una fila específica
 */
function seleccionarFila(fila) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.setActiveRange(sheet.getRange(fila, 1));
}

// ==================== ESTADÍSTICAS ====================

/**
 * Muestra estadísticas de los productos
 */
function mostrarEstadisticas() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const ultimaFila = sheet.getLastRow();

  if (ultimaFila === 1) {
    SpreadsheetApp.getUi().alert('📊 Estadísticas', 'No hay productos registrados.', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }

  const datos = sheet.getRange(2, 1, ultimaFila - 1, 9).getValues();

  const totalProductos = datos.length;
  const productosVisibles = datos.filter(fila => fila[8] === 'SI').length;
  const productosOcultos = totalProductos - productosVisibles;

  // Contar por categoría
  const categorias = {};
  datos.forEach(fila => {
    const cat = fila[5] || 'Sin categoría';
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

// ==================== FUNCIONES DE FORMATO ====================

/**
 * Aplica formato a una fila de producto
 */
function formatearFilaProducto(sheet, fila) {
  const rango = sheet.getRange(fila, 1, 1, 9);

  // Aplicar bordes
  rango.setBorder(true, true, true, true, true, true);

  // Alinear texto
  sheet.getRange(fila, 1).setHorizontalAlignment('center'); // ID
  sheet.getRange(fila, 4, 1, 2).setHorizontalAlignment('right'); // Precios

  // Formato de número para precios
  sheet.getRange(fila, 4, 1, 2).setNumberFormat('#,##0');

  // Color de fondo si está oculto
  const visible = sheet.getRange(fila, 9).getValue();
  if (visible === 'NO') {
    rango.setBackground('#ffcccc');
  } else {
    rango.setBackground('#ffffff');
  }
}
