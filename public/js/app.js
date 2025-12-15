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
