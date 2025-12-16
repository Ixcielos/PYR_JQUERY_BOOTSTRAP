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
