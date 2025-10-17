# 📊 Vista del Dashboard del Tatuador

## 🎯 Información que se Muestra

El dashboard del tatuador muestra **TODA** la información almacenada en el perfil.

---

## 🖼️ Vista Completa del Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  🖌️ Mi Perfil de Artista                          [✏️ Editar]      │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐│
│  │ 👤 Información Profesional   │  │ ℹ️ Información de Contacto   ││
│  ├──────────────────────────────┤  ├──────────────────────────────┤│
│  │                              │  │                              ││
│  │ Nombre Artístico             │  │ Correo Electrónico           ││
│  │ Ink Master                   │  │ artista@example.com          ││
│  │                              │  │                              ││
│  │ Nombre Real                  │  │ Teléfono                     ││
│  │ Juan Pérez García            │  │ +57 300 123 4567             ││
│  │                              │  │                              ││
│  │ Especialidad                 │  │ Portafolio                   ││
│  │ [Realista]                   │  │ 🔗 Ver portafolio            ││
│  │                              │  │                              ││
│  │                              │  │ Tipo de Usuario              ││
│  │                              │  │ [Tatuador]                   ││
│  │                              │  │                              ││
│  └──────────────────────────────┘  └──────────────────────────────┘│
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │              Perfil: ✅ Completo  │  Tipo: Tatuador          │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  Acciones Rápidas                                                  │
│  ┌──────────────────────┐  ┌──────────────────────┐              │
│  │ 🖼️ Mi Portafolio     │  │ 📅 Mi Calendario     │              │
│  └──────────────────────┘  └──────────────────────┘              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Datos que se Muestran

### Sección 1: Información Profesional

| Campo | Ejemplo | Fuente |
|-------|---------|--------|
| **Nombre Artístico** | Ink Master | `perfil.nombre_artistico` |
| **Nombre Real** | Juan Pérez García | `perfil.nombre_real` |
| **Especialidad** | Realista | `perfil.especialidad` |

### Sección 2: Información de Contacto

| Campo | Ejemplo | Fuente |
|-------|---------|--------|
| **Correo Electrónico** | artista@example.com | `perfil.email` |
| **Teléfono** | +57 300 123 4567 | `perfil.telefono` |
| **Portafolio** | 🔗 Ver portafolio | `perfil.portfolio_url` |
| **Tipo de Usuario** | Tatuador | Badge fijo |

### Sección 3: Estadísticas

| Indicador | Valor |
|-----------|-------|
| **Perfil** | ✅ Completo |
| **Tipo** | Tatuador |

### Sección 4: Acciones Rápidas

- 🖼️ **Mi Portafolio** → `portafolio.html`
- 📅 **Mi Calendario** → `calendario.html`

---

## 🎨 Características Visuales

### Diseño
- ✅ Card blanca con sombra suave
- ✅ Dos columnas en desktop
- ✅ Responsive (1 columna en móvil)
- ✅ Bordes redondeados (rounded-3)
- ✅ Espaciado consistente (g-4)

### Colores
- **Títulos**: Color oscuro (#1e293b)
- **Labels**: Color gris (#64748b)
- **Badges**: Púrpura (#667eea)
- **Links**: Púrpura (#667eea)
- **Fondo estadísticas**: Gris claro (#f8fafc)

### Iconos
- 🖌️ Brush (título principal)
- 👤 Person-badge (info profesional)
- ℹ️ Info-circle (info contacto)
- 🔗 Link (portafolio)
- ✏️ Pencil (editar)
- 🖼️ Images (portafolio)
- 📅 Calendar (calendario)

---

## 🔄 Estados del Dashboard

### Estado 1: Sin Perfil Completado

```
┌─────────────────────────────────────┐
│                                     │
│           🖌️                        │
│                                     │
│   Completa tu Perfil de Artista    │
│                                     │
│   Configura tu perfil profesional  │
│   para que los clientes te         │
│   conozcan mejor                   │
│                                     │
│   [✏️ Completar Perfil]            │
│                                     │
└─────────────────────────────────────┘
```

### Estado 2: Perfil Completo (Vista Actual)

```
┌─────────────────────────────────────┐
│ 🖌️ Mi Perfil de Artista  [Editar]  │
├─────────────────────────────────────┤
│ [Información Profesional]           │
│ [Información de Contacto]           │
│ [Estadísticas]                      │
│ [Acciones Rápidas]                  │
└─────────────────────────────────────┘
```

### Estado 3: Error al Cargar

```
┌─────────────────────────────────────┐
│                                     │
│           ⚠️                        │
│                                     │
│   Error al cargar perfil            │
│                                     │
│   No se pudieron obtener los datos │
│                                     │
│   [🔄 Reintentar]                  │
│                                     │
└─────────────────────────────────────┘
```

---

## 📱 Responsive Design

### Desktop (>768px)
```
┌──────────────┐  ┌──────────────┐
│ Info         │  │ Contacto     │
│ Profesional  │  │              │
└──────────────┘  └──────────────┘
```

### Mobile (<768px)
```
┌──────────────┐
│ Info         │
│ Profesional  │
└──────────────┘

┌──────────────┐
│ Contacto     │
│              │
└──────────────┘
```

---

## 🔍 Campos Opcionales

Los siguientes campos **solo se muestran si tienen valor**:

| Campo | Condición | Mensaje si vacío |
|-------|-----------|------------------|
| **Nombre Real** | `if (perfil.nombre_real)` | No se muestra |
| **Especialidad** | `if (perfil.especialidad)` | No se muestra |
| **Teléfono** | `if (perfil.telefono)` | No se muestra |
| **Portafolio** | `if (perfil.portfolio_url)` | No se muestra |

### Ejemplo: Perfil Mínimo

Si solo tiene nombre artístico:

```
┌──────────────────────────────┐
│ 👤 Información Profesional   │
├──────────────────────────────┤
│ Nombre Artístico             │
│ Ink Master                   │
└──────────────────────────────┘

┌──────────────────────────────┐
│ ℹ️ Información de Contacto   │
├──────────────────────────────┤
│ Correo Electrónico           │
│ artista@example.com          │
│                              │
│ Tipo de Usuario              │
│ [Tatuador]                   │
└──────────────────────────────┘
```

---

## 🚀 Cómo Acceder

### Paso 1: Login como Tatuador
```
http://localhost:3000/login.html
```

### Paso 2: Dashboard
Automáticamente redirige a:
```
http://localhost:3000/dashboard.html
```

### Paso 3: Ver Perfil
En el menú lateral, click en:
```
📋 Mi Perfil
```

---

## 🎯 Ejemplo con Datos Reales

### Datos Guardados en BD
```sql
SELECT * FROM tatuadores WHERE id_usuario = 5;
```

Resultado:
```
+------------+------------------+-------------------+--------------+----------------------------------+-----------------+
| id_usuario | nombre_artistico | nombre_real       | especialidad | portfolio_url                    | telefono        |
+------------+------------------+-------------------+--------------+----------------------------------+-----------------+
|          5 | Ink Master       | Juan Pérez García | Realista     | https://instagram.com/inkmaster  | +57 300 123 456 |
+------------+------------------+-------------------+--------------+----------------------------------+-----------------+
```

### Vista en Dashboard
```
┌─────────────────────────────────────────────────────────────────────┐
│  🖌️ Mi Perfil de Artista                          [✏️ Editar]      │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐│
│  │ 👤 Información Profesional   │  │ ℹ️ Información de Contacto   ││
│  │                              │  │                              ││
│  │ Nombre Artístico             │  │ Correo Electrónico           ││
│  │ Ink Master                   │  │ artista@example.com          ││
│  │                              │  │                              ││
│  │ Nombre Real                  │  │ Teléfono                     ││
│  │ Juan Pérez García            │  │ +57 300 123 456              ││
│  │                              │  │                              ││
│  │ Especialidad                 │  │ Portafolio                   ││
│  │ [Realista]                   │  │ 🔗 Ver portafolio            ││
│  │                              │  │ (abre Instagram)             ││
│  └──────────────────────────────┘  └──────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

---

## ✅ Funcionalidades

### Botón "Editar"
- Click → Redirige a `completar-perfil-tatuador.html`
- Formulario se prellena con datos actuales
- Permite modificar cualquier campo
- Al guardar → Actualiza BD y vuelve a dashboard

### Link "Ver portafolio"
- Click → Abre en nueva pestaña
- Target: `_blank`
- Ejemplo: Abre Instagram del tatuador

### Acciones Rápidas
- **Mi Portafolio**: Ver/gestionar trabajos realizados
- **Mi Calendario**: Ver/gestionar citas programadas

---

## 🎨 Código HTML Generado

```html
<div class="card shadow-sm mb-3">
  <div class="card-body">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h5 class="mb-0">
        <i class="bi bi-brush me-2"></i>Mi Perfil de Artista
      </h5>
      <a href="completar-perfil-tatuador.html" class="btn btn-sm btn-outline-primary">
        <i class="bi bi-pencil me-1"></i>Editar
      </a>
    </div>

    <!-- Dos columnas -->
    <div class="row g-4">
      <!-- Columna 1: Info Profesional -->
      <div class="col-md-6">...</div>
      
      <!-- Columna 2: Info Contacto -->
      <div class="col-md-6">...</div>
    </div>

    <!-- Estadísticas -->
    <div class="mt-4 p-3 bg-light rounded-3">...</div>

    <!-- Acciones Rápidas -->
    <div class="mt-4">...</div>
  </div>
</div>
```

---

## 📊 Resumen

### ✅ Información Mostrada
- Nombre Artístico
- Nombre Real
- Especialidad
- Email
- Teléfono
- Portafolio (link clickeable)
- Tipo de usuario

### ✅ Características
- Diseño moderno y limpio
- Responsive
- Campos opcionales ocultos si vacíos
- Botón de editar
- Acciones rápidas
- Manejo de errores

### ✅ Interactividad
- Click en "Editar" → Formulario de edición
- Click en "Ver portafolio" → Abre link externo
- Click en acciones → Navega a otras secciones

**¡El dashboard muestra TODA la información del tatuador de forma clara y organizada!** 🎨✨

---

**Fecha**: Octubre 14, 2025  
**Estado**: ✅ Funcional y Completo
