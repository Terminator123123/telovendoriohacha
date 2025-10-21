/**
 * SISTEMA DE GESTIÓN DE PRODUCTOS - TE LO VENDO RIOHACHA
 * Google Apps Script para gestión rápida de productos
 * Autor: Claude Code
 * Fecha: 2025-10-19
 *
 * ORDEN DE COLUMNAS:
 * 1=ID, 2=NombreProducto, 3=Descripcion, 4=Variantes,
 * 5=PrecioOriginal, 6=PrecioFinal, 7=URL_Imagen, 8=Categoria, 9=Visible
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
 * ORDEN: ID, NombreProducto, Descripcion, Variantes, PrecioOriginal, PrecioFinal, URL_Imagen, Categoria, Visible
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
    id: datos[0],           // Columna 1: ID
    nombre: datos[1],       // Columna 2: NombreProducto
    descripcion: datos[2],  // Columna 3: Descripcion
    variantes: datos[3],    // Columna 4: Variantes
    precioOriginal: datos[4], // Columna 5: PrecioOriginal
    precioFinal: datos[5],  // Columna 6: PrecioFinal
    imagenURL: datos[6],    // Columna 7: URL_Imagen
    categoria: datos[7],    // Columna 8: Categoria
    visible: datos[8]       // Columna 9: Visible
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

  const categorias = sheet.getRange(2, 8, ultimaFila - 1, 1).getValues(); // Columna 8
  const categoriasUnicas = [...new Set(categorias.map(cat => cat[0]).filter(cat => cat !== ''))];

  return categoriasUnicas.sort();
}

// ==================== AGREGAR PRODUCTO ====================

/**
 * Agrega un nuevo producto a la hoja
 * ORDEN: ID, NombreProducto, Descripcion, Variantes, PrecioOriginal, PrecioFinal, URL_Imagen, Categoria, Visible
 */
function agregarProducto(producto) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const siguienteID = obtenerSiguienteID();

    // Validar campos obligatorios
    if (!producto.nombre || !producto.precioFinal) {
      throw new Error('El nombre y el precio final son obligatorios');
    }

    // Preparar datos en EL ORDEN CORRECTO
    const nuevaFila = [
      siguienteID,                    // 1: ID
      producto.nombre,                // 2: NombreProducto
      producto.descripcion || '',     // 3: Descripcion
      producto.variantes || '',       // 4: Variantes
      producto.precioOriginal || '',  // 5: PrecioOriginal
      parseInt(producto.precioFinal), // 6: PrecioFinal
      producto.imagenURL || '',       // 7: URL_Imagen
      producto.categoria || '',       // 8: Categoria
      producto.visible || 'SI'        // 9: Visible
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
 * ORDEN: ID, NombreProducto, Descripcion, Variantes, PrecioOriginal, PrecioFinal, URL_Imagen, Categoria, Visible
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

    // Actualizar datos en EL ORDEN CORRECTO (manteniendo el ID original)
    const datosActualizados = [
      sheet.getRange(fila, 1).getValue(), // 1: ID (mantener original)
      producto.nombre,                    // 2: NombreProducto
      producto.descripcion || '',         // 3: Descripcion
      producto.variantes || '',           // 4: Variantes
      producto.precioOriginal || '',      // 5: PrecioOriginal
      parseInt(producto.precioFinal),     // 6: PrecioFinal
      producto.imagenURL || '',           // 7: URL_Imagen
      producto.categoria || '',           // 8: Categoria
      producto.visible || 'SI'            // 9: Visible
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

  const celdaVisible = sheet.getRange(fila, 9); // Columna 9: Visible
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
    siguienteID,            // 1: ID nuevo
    datos[1] + ' (Copia)',  // 2: NombreProducto con (Copia)
    datos[2],               // 3: Descripcion
    datos[3],               // 4: Variantes
    datos[4],               // 5: PrecioOriginal
    datos[5],               // 6: PrecioFinal
    datos[6],               // 7: URL_Imagen
    datos[7],               // 8: Categoria
    datos[8]                // 9: Visible
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
  const nombreProducto = sheet.getRange(fila, 2).getValue(); // Columna 2: NombreProducto
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
      id: fila[0],          // Columna 1: ID
      nombre: fila[1],      // Columna 2: NombreProducto
      descripcion: fila[2], // Columna 3: Descripcion
      precio: fila[5],      // Columna 6: PrecioFinal
      categoria: fila[7],   // Columna 8: Categoria
      visible: fila[8]      // Columna 9: Visible
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
  const productosVisibles = datos.filter(fila => fila[8] === 'SI').length; // Columna 9: Visible
  const productosOcultos = totalProductos - productosVisibles;

  // Contar por categoría (Columna 8)
  const categorias = {};
  datos.forEach(fila => {
    const cat = fila[7] || 'Sin categoría'; // Columna 8: Categoria
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
  sheet.getRange(fila, 5, 1, 2).setHorizontalAlignment('right'); // Precios (columnas 5 y 6)

  // Formato de número para precios
  sheet.getRange(fila, 5, 1, 2).setNumberFormat('#,##0');

  // Color de fondo si está oculto
  const visible = sheet.getRange(fila, 9).getValue(); // Columna 9: Visible
  if (visible === 'NO') {
    rango.setBackground('#ffcccc');
  } else {
    rango.setBackground('#ffffff');
  }
}
