/**
 * ============================================================================
 * SISTEMA DE GESTIÓN DE PRODUCTOS
 * ============================================================================
 * Aplicación web desarrollada con jQuery y Bootstrap 5.
 * Permite registrar productos, filtrarlos, ordenarlos,
 * mostrarlos en una tabla dinámica y calcular estadísticas.
 * ============================================================================
 */
const aplicacionProductos = {
    
    /**
     * Array que almacena todos los productos registrados
     * @type {Array<Object>}
     */
    arregloProductos: [],
    
    /**
     * Contador para generar IDs únicos automáticamente
     * @type {Number}
     */
    contadorIdProducto: 0,
    
    /**
     * Objeto para almacenar los filtros actuales aplicados
     * @type {Object}
     */
    filtrosActuales: {
        categoria: 'todos',
        busqueda: '',
        ordenamiento: 'ninguno'
    },

    // ========================================================================
    // MÉTODOS INICIALES Y UTILIDADES
    // ========================================================================

    /**
     * Inicializa la aplicación configurando los event listeners
     * Se ejecuta al cargar la página
     */
    inicializarAplicacion: function() {
        console.log('Inicializando aplicación de gestión de productos...');
        
        // Configurar event listeners
        this.configurarEventos();
        
        // Renderizar tabla vacía
        this.renderizarTabla();
        
        console.log('Aplicación inicializada correctamente');
    },

    /**
     * Configura todos los event listeners de la aplicación
     */
    configurarEventos: function() {
        // Botón para agregar producto
        $('#btnAgregarProducto').on('click', () => {
            this.agregarProducto();
        });

        // Permitir agregar producto con Enter en el formulario
        $('#formularioProducto').on('keypress', (evento) => {
            if (evento.which === 13) {
                evento.preventDefault();
                this.agregarProducto();
            }
        });

        // Evento para filtro por categoría
        $('#filtroCategoria').on('change', () => {
            this.filtrosActuales.categoria = $('#filtroCategoria').val();
            this.aplicarFiltrosYOrdenamiento();
        });

        // Evento para búsqueda en vivo (keyup)
        $('#buscadorProducto').on('keyup', () => {
            this.filtrosActuales.busqueda = $('#buscadorProducto').val().toLowerCase();
            this.aplicarFiltrosYOrdenamiento();
        });

        // Evento para ordenamiento por precio
        $('#ordenamientoPrecio').on('change', () => {
            this.filtrosActuales.ordenamiento = $('#ordenamientoPrecio').val();
            this.aplicarFiltrosYOrdenamiento();
        });

        // Botón para limpiar filtros
        $('#btnLimpiarFiltros').on('click', () => {
            this.limpiarFiltros();
        });

        // Botón para ver estadísticas
        $('#btnVerEstadisticas').on('click', () => {
            this.mostrarEstadisticas();
        });

        // Botón para cerrar estadísticas
        $('#btnCerrarEstadisticas').on('click', () => {
            $('#seccionEstadisticas').addClass('d-none');
        });
    },

    // ========================================================================
    // MÉTODOS DE VALIDACIÓN
    // ========================================================================

    /**
     * Valida los campos del formulario de producto
     * @returns {Object} Objeto con propiedades: valido (boolean) y errores (array)
     */
    validarFormularioProducto: function() {
        // Variable para almacenar errores encontrados
        let erroresValidacion = [];
        
        // Obtener valores del formulario
        let nombreIngresado = $('#nombreProducto').val().trim();
        let precioIngresado = $('#precioProducto').val().trim();
        let categoriaIngresada = $('#categoriaProducto').val().trim();

        // Validar nombre del producto
        if (nombreIngresado === '') {
            erroresValidacion.push('El nombre del producto es obligatorio');
        } else if (nombreIngresado.length < 3) {
            erroresValidacion.push('El nombre debe tener al menos 3 caracteres');
        }

        // Validar precio
        if (precioIngresado === '') {
            erroresValidacion.push('El precio es obligatorio');
        } else if (isNaN(precioIngresado) || parseFloat(precioIngresado) <= 0) {
            erroresValidacion.push('El precio debe ser un número mayor a 0');
        }

        // Validar categoría
        if (categoriaIngresada === '') {
            erroresValidacion.push('Debe seleccionar una categoría');
        }

        // Retornar objeto con resultado
        return {
            valido: erroresValidacion.length === 0,
            errores: erroresValidacion
        };
    },

    /**
     * Muestra un mensaje de alerta en la interfaz
     * @param {String} tipo - Tipo de alerta: 'exito', 'error', 'advertencia', 'info'
     * @param {String} titulo - Título del mensaje
     * @param {String} mensaje - Contenido del mensaje
     */
    mostrarAlerta: function(tipo, titulo, mensaje) {
        // Definir clase de Bootstrap según el tipo de alerta
        let claseTipo = '';
        let icono = '';
        
        if (tipo === 'exito') {
            claseTipo = 'alert-success';
            icono = '<i class="bi bi-check-circle-fill"></i>';
        } else if (tipo === 'error') {
            claseTipo = 'alert-danger';
            icono = '<i class="bi bi-exclamation-triangle-fill"></i>';
        } else if (tipo === 'advertencia') {
            claseTipo = 'alert-warning';
            icono = '<i class="bi bi-exclamation-circle-fill"></i>';
        } else {
            claseTipo = 'alert-info';
            icono = '<i class="bi bi-info-circle-fill"></i>';
        }

        // Construir HTML de la alerta
        let htmlAlerta = `
            <div class="alert ${claseTipo} alert-dismissible fade show" role="alert">
                ${icono} <strong>${titulo}</strong> ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

        // Mostrar alerta
        $('#alertaValidacion').html(htmlAlerta);

        // Auto-cerrar alerta después de 5 segundos
        setTimeout(() => {
            $('#alertaValidacion').html('');
        }, 5000);
    },

    // ========================================================================
    // MÉTODOS DE GESTIÓN DE PRODUCTOS
    // ========================================================================

    /**
     * Agrega un nuevo producto al arreglo después de validar
     */
    agregarProducto: function() {
        // Validar formulario
        let resultadoValidacion = this.validarFormularioProducto();

        if (!resultadoValidacion.valido) {
            // Construir mensaje de error
            let mensajeErrores = resultadoValidacion.errores.join('<br>');
            this.mostrarAlerta('error', 'Errores de validación:', mensajeErrores);
            return;
        }

        // Obtener datos del formulario
        let nombreProducto = $('#nombreProducto').val().trim();
        let precioProducto = parseFloat($('#precioProducto').val());
        let categoriaProducto = $('#categoriaProducto').val();

        // Crear objeto producto
        let nuevoProducto = {
            id: ++this.contadorIdProducto,
            nombre: nombreProducto,
            precio: precioProducto,
            categoria: categoriaProducto,
            fechaRegistro: new Date().toLocaleDateString('es-ES')
        };

        // Agregar al arreglo
        this.arregloProductos.push(nuevoProducto);

        // Mostrar mensaje de éxito
        this.mostrarAlerta(
            'exito',
            'Producto agregado:',
            `"${nombreProducto}" ha sido registrado correctamente`
        );

        // Limpiar formulario
        this.limpiarFormulario();

        // Actualizar visualización
        this.aplicarFiltrosYOrdenamiento();
    },

 /**
     * Limpia todos los campos del formulario
     */
    limpiarFormulario: function() {
        $('#formularioProducto')[0].reset();
        $('#nombreProducto').focus();
    },

    /**
     * Elimina un producto del arreglo por su ID
     * @param {Number} idProductoAEliminar - ID del producto a eliminar
     */
    eliminarProducto: function(idProductoAEliminar) {
        // Buscar el índice del producto
        let indiceProducto = -1;
        
        for (let i = 0; i < this.arregloProductos.length; i++) {
            if (this.arregloProductos[i].id === idProductoAEliminar) {
                indiceProducto = i;
                break;
            }
        }

        // Si se encontró, eliminarlo
        if (indiceProducto !== -1) {
            let nombreEliminado = this.arregloProductos[indiceProducto].nombre;
            this.arregloProductos.splice(indiceProducto, 1);
            
            this.mostrarAlerta(
                'exito',
                'Producto eliminado:',
                `"${nombreEliminado}" ha sido removido del sistema`
            );

            // Actualizar visualización
            this.aplicarFiltrosYOrdenamiento();
        }
    },

    // ========================================================================
    // MÉTODOS DE FILTRADO Y BÚSQUEDA
    // ========================================================================

    /**
     * Aplica los filtros y ordenamiento actual a los productos
     * Combina filtro de categoría, búsqueda en vivo y ordenamiento
     */
    aplicarFiltrosYOrdenamiento: function() {
        // Copiar arreglo original para no modificarlo
        let productosFiltrados = [];

        // Aplicar filtro de categoría
        for (let i = 0; i < this.arregloProductos.length; i++) {
            let producto = this.arregloProductos[i];
            
            // Verificar si cumple el filtro de categoría
            if (this.filtrosActuales.categoria !== 'todos' && 
                producto.categoria !== this.filtrosActuales.categoria) {
                continue;
            }

            // Verificar si cumple el filtro de búsqueda
            if (this.filtrosActuales.busqueda !== '' && 
                !producto.nombre.toLowerCase().includes(this.filtrosActuales.busqueda)) {
                continue;
            }

            // Si llega aquí, cumple todos los filtros
            productosFiltrados.push(producto);
        }

        // Aplicar ordenamiento por precio
        if (this.filtrosActuales.ordenamiento === 'ascendente') {
            // Ordenar de menor a mayor precio
            for (let i = 0; i < productosFiltrados.length - 1; i++) {
                for (let j = 0; j < productosFiltrados.length - 1 - i; j++) {
                    if (productosFiltrados[j].precio > productosFiltrados[j + 1].precio) {
                        // Intercambiar elementos
                        let temporal = productosFiltrados[j];
                        productosFiltrados[j] = productosFiltrados[j + 1];
                        productosFiltrados[j + 1] = temporal;
                    }
                }
            }
        } else if (this.filtrosActuales.ordenamiento === 'descendente') {
            // Ordenar de mayor a menor precio
            for (let i = 0; i < productosFiltrados.length - 1; i++) {
                for (let j = 0; j < productosFiltrados.length - 1 - i; j++) {
                    if (productosFiltrados[j].precio < productosFiltrados[j + 1].precio) {
                        // Intercambiar elementos
                        let temporal = productosFiltrados[j];
                        productosFiltrados[j] = productosFiltrados[j + 1];
                        productosFiltrados[j + 1] = temporal;
                    }
                }
            }
        }

        // Renderizar tabla con los productos filtrados
        this.renderizarTablaProductos(productosFiltrados);
    },

    /**
     * Limpia todos los filtros y restaura la visualización original
     */
    limpiarFiltros: function() {
        // Resetear filtros
        this.filtrosActuales.categoria = 'todos';
        this.filtrosActuales.busqueda = '';
        this.filtrosActuales.ordenamiento = 'ninguno';

        // Resetear valores en la interfaz
        $('#filtroCategoria').val('todos');
        $('#buscadorProducto').val('');
        $('#ordenamientoPrecio').val('ninguno');

        // Actualizar visualización
        this.aplicarFiltrosYOrdenamiento();

        // Mostrar alerta
        this.mostrarAlerta('info', 'Filtros limpios', 'Todos los filtros han sido restablecidos');
    },

// ========================================================================
    // MÉTODOS DE RENDERIZACIÓN
    // ========================================================================

    /**
     * Renderiza la tabla de productos completa
     * Si el arreglo está vacío, muestra un mensaje
     */
    renderizarTabla: function() {
        if (this.arregloProductos.length === 0) {
            $('#mensajeSinProductos').removeClass('d-none');
            $('#tablaProductos').addClass('d-none');
        } else {
            $('#mensajeSinProductos').addClass('d-none');
            $('#tablaProductos').removeClass('d-none');
        }
    },

    /**
     * Renderiza los productos en la tabla según el arreglo proporcionado
     * @param {Array<Object>} arregloProductosAMostrar - Array de productos a mostrar
     */
    renderizarTablaProductos: function(arregloProductosAMostrar) {
        // Obtener referencia al cuerpo de la tabla
        let cuerpoTabla = $('#cuerpoTabla');
        
        // Limpiar contenido previo
        cuerpoTabla.html('');

        // Verificar si hay productos
        if (arregloProductosAMostrar.length === 0) {
            $('#mensajeSinProductos').removeClass('d-none');
            $('#tablaProductos').addClass('d-none');
            return;
        }

        $('#mensajeSinProductos').addClass('d-none');
        $('#tablaProductos').removeClass('d-none');

        // Iterar sobre los productos para construir las filas
        for (let i = 0; i < arregloProductosAMostrar.length; i++) {
            let producto = arregloProductosAMostrar[i];

            // Construir fila HTML
            let fila = `
                <tr data-id-producto="${producto.id}">
                    <td><strong>#${producto.id}</strong></td>
                    <td>${producto.nombre}</td>
                    <td>
                        <span class="badge bg-info">$${producto.precio.toFixed(2)}</span>
                    </td>
                    <td>
                        <span class="badge bg-secondary">${producto.categoria}</span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-danger btnEliminarProducto" 
                                data-id="${producto.id}"
                                title="Eliminar producto">
                            <i class="bi bi-trash-fill"></i> Eliminar
                        </button>
                    </td>
                </tr>
            `;

            // Agregar fila a la tabla
            cuerpoTabla.append(fila);
        }

        // Configurar event listeners para botones de eliminar
        $('.btnEliminarProducto').on('click', (evento) => {
            let idProductoAEliminar = parseInt($(evento.currentTarget).data('id'));
            this.eliminarProducto(idProductoAEliminar);
        });
    },

     // ========================================================================
    // MÉTODOS DE ESTADÍSTICAS
    // ========================================================================

    /**
     * Calcula y muestra las estadísticas del sistema
     */
    mostrarEstadisticas: function() {
        // Verificar si hay productos
        if (this.arregloProductos.length === 0) {
            this.mostrarAlerta('advertencia', 'Sin datos', 'No hay productos para mostrar estadísticas');
            return;
        }

        // Calcular estadísticas
        let estadisticas = this.calcularEstadisticas();

        // Actualizar interfaz con los datos
        $('#estadisticaTotalProductos').text(estadisticas.totalProductos);
        $('#estadisticaPrecioPromedio').text('$' + estadisticas.precioPromedio.toFixed(2));
        $('#estadisticaProductoMasBarato').text(estadisticas.productoMasBarato.nombre);
        $('#estadisticaPrecioMasBarato').text('$' + estadisticas.productoMasBarato.precio.toFixed(2));
        $('#estadisticaProductoMasWaro').text(estadisticas.productoMasWaro.nombre);
        $('#estadisticaPrecioMasWaro').text('$' + estadisticas.productoMasWaro.precio.toFixed(2));

        // Mostrar sección de estadísticas
        $('#seccionEstadisticas').removeClass('d-none');

        // Scroll hacia las estadísticas
        $('html, body').animate({
            scrollTop: $('#seccionEstadisticas').offset().top - 100
        }, 'slow');
    },

    /**
     * Calcula todas las estadísticas del sistema
     * @returns {Object} Objeto con las estadísticas calculadas
     */
    calcularEstadisticas: function() {
        let totalProductos = 0;
        let sumaPrecios = 0;
        let productoMasBarato = null;
        let productoMasWaro = null;

        // Iterar sobre todos los productos
        for (let i = 0; i < this.arregloProductos.length; i++) {
            let producto = this.arregloProductos[i];

            // Contar productos
            totalProductos++;

            // Sumar precios
            sumaPrecios += producto.precio;

            // Encontrar producto más barato
            if (productoMasBarato === null || producto.precio < productoMasBarato.precio) {
                productoMasBarato = producto;
            }

            // Encontrar producto más caro
            if (productoMasWaro === null || producto.precio > productoMasWaro.precio) {
                productoMasWaro = producto;
            }
        }

        // Calcular promedio
        let precioPromedio = totalProductos > 0 ? sumaPrecios / totalProductos : 0;

        // Retornar estadísticas
        return {
            totalProductos: totalProductos,
            precioPromedio: precioPromedio,
            productoMasBarato: productoMasBarato,
            productoMasWaro: productoMasWaro
        };
    }
};

// ============================================================================
// INICIALIZACIÓN CUANDO EL DOCUMENTO ESTÉ LISTO
// ============================================================================

/**
 * Ejecuta la inicialización de la aplicación cuando jQuery esté lista
 */
$(document).ready(function() {
    aplicacionProductos.inicializarAplicacion();
});
