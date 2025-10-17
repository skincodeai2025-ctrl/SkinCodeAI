# 📋 Guía de Servicios - SkinCodeIA

## 🎯 Archivos Creados

He creado **2 archivos SQL** con datos de ejemplo para la tabla `servicios`:

### 1. `datos_servicios_ejemplo.sql`
- **66 servicios completos** con descripciones detalladas
- Sin precios (para que los configures según tu negocio)
- Incluye todos los tipos de servicios

### 2. `servicios_basicos_con_precios.sql`
- **36 servicios esenciales** con precios sugeridos
- Precios en pesos colombianos (COP)
- Versión lista para usar

---

## 📊 Resumen de Servicios

### 🎨 TATUAJES (32 servicios en archivo completo)

#### Por Tamaño (5)
| Servicio | Descripción | Precio Sugerido |
|----------|-------------|-----------------|
| **Tatuaje Mini** | 2-5 cm, 30-60 min | $80,000 |
| **Tatuaje Pequeño** | 5-10 cm, 1-2 horas | $150,000 |
| **Tatuaje Mediano** | 10-20 cm, 2-4 horas | $300,000 |
| **Tatuaje Grande** | 20-30 cm, 4-6 horas | $500,000 |
| **Tatuaje Extra Grande** | +30 cm, 6+ horas | $800,000 |

#### Por Estilo (10)
| Servicio | Precio Sugerido |
|----------|-----------------|
| **Realista** | $400,000 |
| **Tradicional** | $250,000 |
| **Minimalista** | $120,000 |
| **Geométrico** | $280,000 |
| **Acuarela** | $350,000 |
| **Blackwork** | $300,000 |
| **Dotwork** | $320,000 |
| **Neo-Tradicional** | $280,000 |
| **Japonés** | $450,000 |
| **Tribal** | $250,000 |

#### Por Ubicación (7)
- Brazo
- Pierna
- Espalda
- Pecho
- Cuello
- Mano
- Pie

#### Especiales (7)
| Servicio | Precio Sugerido |
|----------|-----------------|
| **Cover-Up** | $400,000 |
| **Retoque** | $100,000 |
| **Letras/Texto** | $150,000 |
| **Retrato** | $500,000 |
| **Pareja/Matching** | $200,000 |
| **Temporal (Henna)** | $50,000 |
| **Diseño Personalizado** | $50,000 |

---

### 💎 PIERCINGS (30 servicios en archivo completo)

#### Faciales (9)
| Servicio | Cicatrización | Precio Sugerido |
|----------|---------------|-----------------|
| **Nariz (Nostril)** | 2-4 meses | $40,000 |
| **Septum** | 2-3 meses | $50,000 |
| **Bridge** | 2-3 meses | $60,000 |
| **Ceja** | 2-3 meses | $45,000 |
| **Labret** | 2-3 meses | $45,000 |
| **Monroe/Madonna** | 2-3 meses | $45,000 |
| **Medusa** | 2-3 meses | $45,000 |
| **Snake Bites** | 2-3 meses | $80,000 (ambos) |
| **Angel Bites** | 2-3 meses | $80,000 (ambos) |

#### Oreja (10)
| Servicio | Cicatrización | Precio Sugerido |
|----------|---------------|-----------------|
| **Lóbulo** | 1-2 meses | $30,000 |
| **Helix** | 3-6 meses | $40,000 |
| **Tragus** | 3-6 meses | $45,000 |
| **Anti-Tragus** | 3-6 meses | $50,000 |
| **Conch** | 3-6 meses | $50,000 |
| **Daith** | 3-6 meses | $50,000 |
| **Rook** | 3-6 meses | $55,000 |
| **Industrial** | 6-12 meses | $70,000 |
| **Snug** | 6-12 meses | $55,000 |
| **Forward Helix** | 3-6 meses | $45,000 |

#### Corporales (5)
| Servicio | Cicatrización | Precio Sugerido |
|----------|---------------|-----------------|
| **Lengua** | 4-6 semanas | $50,000 |
| **Ombligo** | 6-12 meses | $50,000 |
| **Pezón** | 6-12 meses | $60,000 (c/u) |
| **Surface** | 3-6 meses | $70,000 |
| **Dermal/Microdermal** | 1-3 meses | $80,000 |

#### Servicios Adicionales (5)
| Servicio | Precio Sugerido |
|----------|-----------------|
| **Cambio de Joya** | $15,000 |
| **Retiro** | $10,000 |
| **Expansión de Lóbulo** | $40,000 |
| **Curación Problemático** | $50,000 |
| **Kit de Cuidados** | $25,000 |

---

### 🎁 PAQUETES Y OTROS (4 servicios)

| Servicio | Precio Sugerido | Ahorro |
|----------|-----------------|--------|
| **3 Piercings Lóbulo** | $75,000 | $15,000 |
| **Tatuaje Mini + Piercing** | $110,000 | $20,000 |
| **Consulta Personalizada** | $30,000 | - |
| **Certificado de Regalo** | Variable | - |

---

## 🚀 Cómo Usar los Archivos

### Opción 1: Archivo Completo (66 servicios)

```bash
# 1. Abre phpMyAdmin o MySQL Workbench
# 2. Selecciona la base de datos 'skincodeia'
# 3. Ejecuta el archivo:
```

```sql
SOURCE /ruta/a/datos_servicios_ejemplo.sql;
```

**Ventajas:**
- ✅ Catálogo completo de servicios
- ✅ Descripciones detalladas
- ✅ Puedes agregar precios después

**Desventajas:**
- ⚠️ Muchos servicios (puede ser abrumador al inicio)
- ⚠️ Requiere configurar precios manualmente

---

### Opción 2: Archivo Básico (36 servicios con precios)

```bash
# 1. Abre phpMyAdmin o MySQL Workbench
# 2. Selecciona la base de datos 'skincodeia'
# 3. Ejecuta el archivo:
```

```sql
SOURCE /ruta/a/servicios_basicos_con_precios.sql;
```

**Ventajas:**
- ✅ Servicios esenciales listos para usar
- ✅ Precios sugeridos incluidos
- ✅ Más fácil de gestionar al inicio

**Desventajas:**
- ⚠️ Menos variedad de servicios
- ⚠️ Precios genéricos (ajustar según tu mercado)

---

## 📝 Pasos Detallados

### Método 1: phpMyAdmin

1. **Accede a phpMyAdmin**
   ```
   http://localhost/phpmyadmin
   ```

2. **Selecciona la base de datos**
   - Click en `skincodeia` en el panel izquierdo

3. **Importa el archivo**
   - Click en la pestaña "Importar"
   - Click en "Seleccionar archivo"
   - Elige `servicios_basicos_con_precios.sql`
   - Click en "Continuar"

4. **Verifica**
   ```sql
   SELECT * FROM servicios;
   ```

---

### Método 2: Línea de Comandos MySQL

```bash
# Navega a la carpeta database
cd c:\xampp2\htdocs\skincodeia2_13102025_08_00\database

# Ejecuta el script
mysql -u root -p skincodeia < servicios_basicos_con_precios.sql
```

---

### Método 3: Copiar y Pegar

1. Abre el archivo `.sql` en un editor de texto
2. Copia todo el contenido
3. Abre phpMyAdmin → skincodeia → SQL
4. Pega el contenido
5. Click en "Continuar"

---

## 🔧 Personalizar Precios

### Actualizar todos los precios (aumentar 10%)

```sql
UPDATE servicios 
SET precio = precio * 1.10 
WHERE precio IS NOT NULL;
```

### Actualizar precios por categoría

```sql
-- Aumentar precios de tatuajes 15%
UPDATE servicios 
SET precio = precio * 1.15 
WHERE nombre LIKE '%Tatuaje%';

-- Disminuir precios de piercings 5%
UPDATE servicios 
SET precio = precio * 0.95 
WHERE nombre LIKE '%Piercing%';
```

### Establecer precio específico

```sql
-- Cambiar precio de un servicio específico
UPDATE servicios 
SET precio = 120000 
WHERE nombre = 'Tatuaje Minimalista';
```

### Agregar descuentos

```sql
-- Agregar columna de descuento
ALTER TABLE servicios 
ADD COLUMN descuento DECIMAL(5,2) DEFAULT 0 
AFTER precio;

-- Aplicar descuento del 20% a paquetes
UPDATE servicios 
SET descuento = 20.00 
WHERE nombre LIKE '%Paquete%';
```

---

## 📊 Consultas Útiles

### Ver servicios más caros

```sql
SELECT nombre, precio 
FROM servicios 
WHERE precio IS NOT NULL
ORDER BY precio DESC 
LIMIT 10;
```

### Ver servicios por rango de precio

```sql
-- Servicios entre $50,000 y $200,000
SELECT nombre, precio 
FROM servicios 
WHERE precio BETWEEN 50000 AND 200000
ORDER BY precio;
```

### Contar servicios por categoría

```sql
SELECT 
    CASE 
        WHEN nombre LIKE '%Tatuaje%' THEN 'Tatuajes'
        WHEN nombre LIKE '%Piercing%' THEN 'Piercings'
        ELSE 'Otros'
    END as categoria,
    COUNT(*) as cantidad,
    MIN(precio) as precio_min,
    MAX(precio) as precio_max,
    AVG(precio) as precio_promedio
FROM servicios
GROUP BY categoria;
```

### Buscar servicios por palabra clave

```sql
-- Buscar servicios de oreja
SELECT nombre, descripcion, precio 
FROM servicios 
WHERE nombre LIKE '%oreja%' 
   OR descripcion LIKE '%oreja%';
```

---

## 🎨 Agregar Más Campos (Opcional)

### Agregar duración estimada

```sql
ALTER TABLE servicios 
ADD COLUMN duracion_minutos INT NULL 
AFTER descripcion;

-- Actualizar duraciones
UPDATE servicios SET duracion_minutos = 30 WHERE nombre LIKE '%Mini%';
UPDATE servicios SET duracion_minutos = 90 WHERE nombre LIKE '%Pequeño%';
UPDATE servicios SET duracion_minutos = 180 WHERE nombre LIKE '%Mediano%';
```

### Agregar categoría

```sql
ALTER TABLE servicios 
ADD COLUMN categoria ENUM('tatuaje', 'piercing', 'paquete', 'otro') 
AFTER nombre;

-- Actualizar categorías
UPDATE servicios SET categoria = 'tatuaje' WHERE nombre LIKE '%Tatuaje%';
UPDATE servicios SET categoria = 'piercing' WHERE nombre LIKE '%Piercing%';
UPDATE servicios SET categoria = 'paquete' WHERE nombre LIKE '%Paquete%';
```

### Agregar imagen

```sql
ALTER TABLE servicios 
ADD COLUMN imagen_url VARCHAR(300) NULL 
AFTER descripcion;

-- Ejemplo de actualización
UPDATE servicios 
SET imagen_url = '/images/servicios/tatuaje-mini.jpg' 
WHERE nombre = 'Tatuaje Mini (2-5cm)';
```

### Agregar nivel de dolor

```sql
ALTER TABLE servicios 
ADD COLUMN nivel_dolor ENUM('bajo', 'medio', 'alto', 'muy_alto') NULL 
AFTER descripcion;

-- Actualizar niveles
UPDATE servicios SET nivel_dolor = 'bajo' WHERE nombre LIKE '%Lóbulo%';
UPDATE servicios SET nivel_dolor = 'medio' WHERE nombre LIKE '%Helix%';
UPDATE servicios SET nivel_dolor = 'alto' WHERE nombre LIKE '%Cartílago%';
```

---

## 📱 Integración con el Frontend

### Cargar servicios en un select

```javascript
// En tu archivo JS
async function cargarServicios() {
  const response = await fetch('/api/servicios', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  const servicios = await response.json();
  
  const select = document.getElementById('servicio');
  select.innerHTML = '<option value="">Selecciona un servicio</option>';
  
  servicios.forEach(servicio => {
    const option = document.createElement('option');
    option.value = servicio.id_servicio;
    option.textContent = `${servicio.nombre} - $${servicio.precio?.toLocaleString()}`;
    select.appendChild(option);
  });
}
```

### Mostrar servicios en tarjetas

```javascript
function renderizarServicios(servicios) {
  const container = document.getElementById('servicios-container');
  
  servicios.forEach(servicio => {
    const card = `
      <div class="col-md-4 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">${servicio.nombre}</h5>
            <p class="card-text">${servicio.descripcion}</p>
            <p class="text-primary fw-bold">$${servicio.precio?.toLocaleString()}</p>
            <button class="btn btn-primary" onclick="seleccionarServicio(${servicio.id_servicio})">
              Solicitar
            </button>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += card;
  });
}
```

---

## 🎯 Recomendaciones

### Para Comenzar

1. **Usa el archivo básico** (`servicios_basicos_con_precios.sql`)
2. **Ajusta los precios** según tu mercado local
3. **Prueba el sistema** con estos servicios
4. **Agrega más servicios** según la demanda

### Para Escalar

1. **Agrega campos adicionales** (duración, categoría, imagen)
2. **Crea paquetes personalizados** según temporada
3. **Implementa descuentos** para clientes frecuentes
4. **Analiza servicios más solicitados** y optimiza precios

### Mejores Prácticas

- ✅ Mantén descripciones claras y concisas
- ✅ Actualiza precios regularmente
- ✅ Desactiva servicios temporalmente en lugar de eliminarlos
- ✅ Usa nombres descriptivos y consistentes
- ✅ Incluye tiempo estimado en la descripción
- ✅ Especifica qué incluye cada servicio

---

## 📊 Estadísticas de los Servicios

### Archivo Completo (66 servicios)
- 🎨 **32 Tatuajes** (48%)
- 💎 **30 Piercings** (46%)
- 🎁 **4 Paquetes/Otros** (6%)

### Archivo Básico (36 servicios)
- 🎨 **13 Tatuajes** (36%)
- 💎 **20 Piercings** (56%)
- 🎁 **3 Paquetes** (8%)

---

## ✅ Checklist de Implementación

- [ ] Ejecutar script SQL
- [ ] Verificar que se insertaron correctamente
- [ ] Ajustar precios según tu mercado
- [ ] Probar carga de servicios en frontend
- [ ] Configurar filtros por categoría
- [ ] Agregar imágenes (opcional)
- [ ] Crear paquetes personalizados
- [ ] Documentar servicios para el equipo

---

## 🆘 Solución de Problemas

### Error: "Table 'servicios' doesn't exist"
```sql
-- Crear tabla si no existe
CREATE TABLE IF NOT EXISTS servicios (
  id_servicio INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT NULL,
  precio DECIMAL(10,2) NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
```

### Error: "Column 'precio' doesn't exist"
```sql
-- Agregar columna precio
ALTER TABLE servicios 
ADD COLUMN precio DECIMAL(10,2) NULL 
AFTER descripcion;
```

### Limpiar y reiniciar
```sql
-- CUIDADO: Esto borra todos los servicios
DELETE FROM servicios;
ALTER TABLE servicios AUTO_INCREMENT = 1;

-- Luego ejecuta el script nuevamente
```

---

## 📞 Contacto y Soporte

Si necesitas ayuda con:
- Personalización de servicios
- Ajuste de precios
- Integración con frontend
- Reportes y estadísticas

¡Estoy aquí para ayudarte! 🚀

---

**Fecha de creación:** Octubre 15, 2025  
**Versión:** 1.0  
**Estado:** ✅ Listo para usar
