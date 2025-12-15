# 📦 Sistema de Gestión de Productos

## 👥 Integrantes del Grupo

- **Grupo:** 4
1. **Briggette Floril**
2. **Abigail Reyes**  
3. **Felix Narvaéz**  
4. **Katherine Vargas**  
5. **Sebastian Sandoval**  
- **Carrera:** Ingeniería en Tecnologías de la Información y Comunicaciones (TICS)
- **Ciclo:** 5to Ciclo
- **Curso:** Aplicación de Tecnologías Web

## Descripción General

**Sistema de Gestión de Productos** es una mini-aplicación web desarrollada con **jQuery 3.7.1** y **Bootstrap 5** que permite gestionar un inventario de productos de manera interactiva y eficiente. La aplicación funciona completamente en un entorno local sin necesidad de servidor backend.

### 🎯 Objetivo

Aplicar y reforzar los conocimientos sobre:
- ✅ Estructuras de control (if, else if, else)
- ✅ Estructuras iterativas (for, forEach, while)
- ✅ Arrays y objetos en JavaScript
- ✅ Manejo de eventos con jQuery
- ✅ Manipulación dinámica del DOM
- ✅ Componentes de Bootstrap 5
- ✅ Validación de formularios
- ✅ Cálculos y estadísticas

---

## 📋 Estructura del Proyecto

```
PYR_JQUERY_BOOTSTRAP/
├── index.html                           # Página principal
├── REDME.MD                            # Documentación
└── public/
    ├── css/
    │   └── styless.css                # Estilos personalizados
    ├── js/
    │   └── app.js                     # Lógica principal de la aplicación
    └── vendor/
        ├── bootstrap-5.0.2-dist/      # Archivos de Bootstrap 5
        │   ├── css/                   # Estilos de Bootstrap
        │   └── js/                    # Scripts de Bootstrap
        └── jquery/
            └── jquery-3.7.1.min.js    # Librería jQuery
```

---

### Métodos Principales de la Aplicación

#### `inicializarAplicacion()`
Configura todos los event listeners y renderiza la tabla inicial.

#### `agregarProducto()`
Valida y agrega un nuevo producto al array.

#### `validarFormularioProducto()`
Valida los campos del formulario retornando errores si existen.

#### `eliminarProducto(idProductoAEliminar)`
Elimina un producto del array usando su ID.

#### `aplicarFiltrosYOrdenamiento()`
Aplica todos los filtros y ordenamientos actuales combinados.

#### `calcularEstadisticas()`
Calcula todas las estadísticas usando estructuras iterativas.

#### `renderizarTablaProductos(arregloProductosAMostrar)`
Genera dinámicamente el HTML de la tabla.

---

## 🔒 Validación de Datos

El sistema valida:

✅ **Nombre del Producto**
- No puede estar vacío
- Mínimo 3 caracteres
- Máximo 100 caracteres

✅ **Precio**
- Es obligatorio
- Debe ser un número válido
- Mayor a 0
- Máximo 2 decimales

✅ **Categoría**
- Debe seleccionar una opción
- Solo: Abarrotes, Bebidas, Limpieza

---

## 🔄 Flujo de Operaciones

### Agregar Producto
```
Usuario completa formulario
        ↓
Valida datos
        ↓
Si hay errores → Muestra alerta
Si correcto → Crea objeto
        ↓
Agrega al array
        ↓
Limpia formulario
        ↓
Actualiza tabla
```

### Filtrar y Buscar
```
Usuario modifica filtro/búsqueda
        ↓
Actualiza filtrosActuales
        ↓
Aplica filtros (para cada producto)
        ↓
Aplica ordenamiento (si hay)
        ↓
Renderiza tabla actualizada
```

### Calcular Estadísticas
```
Usuario presiona "Ver Estadísticas"
        ↓
Verifica si hay productos
        ↓
Itera sobre array calculando:
  - Total
  - Promedio
  - Mínimo
  - Máximo
        ↓
Actualiza interfaz
        ↓
Muestra sección estadísticas
```
---