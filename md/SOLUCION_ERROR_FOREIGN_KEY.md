# 🔧 Solución: Error de Foreign Key al Eliminar Tabla Citas

## ❌ Error Recibido

```
#1451 - No puede deletear una línea padre: falla de clave extranjera constraint
```

## 🔍 Causa del Problema

Este error ocurre porque hay **otras tablas** que tienen foreign keys (claves foráneas) que apuntan a la tabla `citas`. 

Probablemente estas tablas:
- `pagos` (tiene `id_cita` que referencia a `citas`)
- `notificaciones` (tiene `id_cita` que referencia a `citas`)

MySQL no permite eliminar una tabla "padre" si hay tablas "hijas" que dependen de ella.

---

## ✅ Solución Rápida (Recomendada)

He creado un script que maneja automáticamente todas las dependencias.

### Paso 1: Abre phpMyAdmin
```
http://localhost/phpmyadmin
```

### Paso 2: Selecciona la base de datos
- Click en **`skincodeia`** en el panel izquierdo

### Paso 3: Ejecuta el nuevo script
- Click en la pestaña **"SQL"**
- Click en **"Importar archivos"** (ícono de carpeta)
- Navega a: `database/`
- Selecciona: **`corregir_citas_con_dependencias.sql`**
- Click en **"Continuar"**

### ✅ Este script:
1. ✅ Deshabilita temporalmente las verificaciones de foreign keys
2. ✅ Elimina las tablas dependientes (`pagos`, `notificaciones`)
3. ✅ Elimina la tabla `citas`
4. ✅ Recrea `citas` con la estructura correcta
5. ✅ Recrea `pagos` con la estructura correcta
6. ✅ Recrea `notificaciones` con la estructura correcta
7. ✅ Rehabilita las verificaciones
8. ✅ Inserta datos de prueba

---

## 🔍 Alternativa: Identificar Dependencias Primero

Si quieres ver qué tablas dependen de `citas` antes de eliminarlas:

### Ejecuta este script:
```sql
-- Archivo: identificar_dependencias_citas.sql
```

O copia y pega esto en phpMyAdmin → SQL:

```sql
USE skincodeia;

-- Ver qué tablas dependen de citas
SELECT 
    TABLE_NAME as 'Tabla que depende de citas',
    CONSTRAINT_NAME as 'Constraint',
    COLUMN_NAME as 'Columna'
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'skincodeia' 
  AND REFERENCED_TABLE_NAME = 'citas';
```

Esto te mostrará algo como:
```
+---------------------------+------------------------+-----------+
| Tabla que depende de citas| Constraint             | Columna   |
+---------------------------+------------------------+-----------+
| pagos                     | fk_pagos_cita          | id_cita   |
| notificaciones            | fk_notif_cita          | id_cita   |
+---------------------------+------------------------+-----------+
```

---

## 🛠️ Solución Manual (Paso a Paso)

Si prefieres hacerlo manualmente:

### Paso 1: Identificar dependencias
```sql
SELECT TABLE_NAME, CONSTRAINT_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'skincodeia' 
  AND REFERENCED_TABLE_NAME = 'citas';
```

### Paso 2: Eliminar foreign keys de las tablas dependientes
```sql
-- Ejemplo si pagos depende de citas
ALTER TABLE pagos DROP FOREIGN KEY fk_pagos_cita;

-- Ejemplo si notificaciones depende de citas
ALTER TABLE notificaciones DROP FOREIGN KEY fk_notif_cita;
```

### Paso 3: Eliminar las tablas dependientes
```sql
DROP TABLE IF EXISTS pagos;
DROP TABLE IF EXISTS notificaciones;
```

### Paso 4: Ahora sí, eliminar citas
```sql
DROP TABLE IF EXISTS citas;
```

### Paso 5: Recrear todas las tablas
```sql
-- Crear citas
CREATE TABLE citas (...);

-- Crear pagos
CREATE TABLE pagos (...);

-- Crear notificaciones
CREATE TABLE notificaciones (...);
```

---

## 📋 Método Más Simple (Copiar y Pegar)

Copia y pega esto directamente en phpMyAdmin → SQL:

```sql
USE skincodeia;

-- Deshabilitar checks
SET FOREIGN_KEY_CHECKS = 0;

-- Eliminar tablas
DROP TABLE IF EXISTS pagos;
DROP TABLE IF EXISTS notificaciones;
DROP TABLE IF EXISTS citas;

-- Crear citas
CREATE TABLE citas (
  id_cita INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario_cliente INT NOT NULL,
  id_usuario_tatuador INT NULL,
  id_servicio INT NULL,
  estado ENUM('solicitud','programada','confirmada','cancelada','realizada') NOT NULL DEFAULT 'solicitud',
  fecha_hora_inicio DATETIME NULL,
  fecha_hora_fin DATETIME NULL,
  precio DECIMAL(10,2) NULL,
  notas_cliente TEXT NULL,
  notas_internas TEXT NULL,
  url_referencia VARCHAR(300) NULL,
  pago_estado ENUM('pendiente','pagado','reembolsado') DEFAULT 'pendiente',
  pago_monto DECIMAL(10,2) NULL,
  pago_fecha DATETIME NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_citas_cliente FOREIGN KEY (id_usuario_cliente) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_citas_tatuador FOREIGN KEY (id_usuario_tatuador) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
  CONSTRAINT fk_citas_servicio FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Crear índices
CREATE INDEX idx_citas_cliente ON citas(id_usuario_cliente);
CREATE INDEX idx_citas_tatuador ON citas(id_usuario_tatuador);
CREATE INDEX idx_citas_estado ON citas(estado);
CREATE INDEX idx_citas_fecha_inicio ON citas(fecha_hora_inicio);

-- Crear pagos
CREATE TABLE pagos (
  id_pago INT AUTO_INCREMENT PRIMARY KEY,
  id_cita INT NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  metodo ENUM('efectivo','electronico','bitcoin') NOT NULL DEFAULT 'efectivo',
  estado ENUM('pendiente','completado','fallido','reembolsado') NOT NULL DEFAULT 'pendiente',
  referencia VARCHAR(100) NULL,
  fecha_pago DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notas TEXT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pagos_cita FOREIGN KEY (id_cita) REFERENCES citas(id_cita) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Crear notificaciones
CREATE TABLE notificaciones (
  id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_cita INT NULL,
  tipo ENUM('cita_creada','cita_programada','cita_confirmada','cita_cancelada','cita_realizada','recordatorio','pago_recibido','mensaje') NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  mensaje TEXT NOT NULL,
  leida TINYINT(1) NOT NULL DEFAULT 0,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notif_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_notif_cita FOREIGN KEY (id_cita) REFERENCES citas(id_cita) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Crear índices para notificaciones
CREATE INDEX idx_notif_usuario ON notificaciones(id_usuario);
CREATE INDEX idx_notif_leida ON notificaciones(leida);
CREATE INDEX idx_notif_cita ON notificaciones(id_cita);

-- Rehabilitar checks
SET FOREIGN_KEY_CHECKS = 1;

-- Verificar
DESCRIBE citas;
SELECT '✅ TABLAS CREADAS CORRECTAMENTE' AS Resultado;
```

---

## ⚠️ Importante: Respaldo de Datos

Si tienes datos importantes en estas tablas:

### Opción 1: Exportar antes de eliminar

1. En phpMyAdmin, selecciona la tabla `citas`
2. Click en "Exportar"
3. Guarda el archivo SQL
4. Repite para `pagos` y `notificaciones`

### Opción 2: Crear respaldo en la base de datos

```sql
-- Crear respaldos
CREATE TABLE citas_backup AS SELECT * FROM citas;
CREATE TABLE pagos_backup AS SELECT * FROM pagos;
CREATE TABLE notificaciones_backup AS SELECT * FROM notificaciones;

-- Verificar respaldos
SELECT COUNT(*) FROM citas_backup;
SELECT COUNT(*) FROM pagos_backup;
SELECT COUNT(*) FROM notificaciones_backup;
```

Luego, después de recrear las tablas, puedes restaurar los datos ajustando las columnas.

---

## 🔄 Después de Ejecutar el Script

### 1. Verificar que funcionó

```sql
-- Ver estructura de citas
DESCRIBE citas;

-- Debe mostrar id_usuario_cliente (no id_cliente)
```

### 2. Reiniciar el servidor Node.js

El servidor debería reiniciarse automáticamente con nodemon.

Si no:
```bash
# Ctrl+C en la terminal
npm run dev
```

### 3. Verificar que no hay errores

En la terminal deberías ver:
```
Servidor corriendo en http://localhost:3000
```

**Sin errores de "Unknown column".**

---

## 📊 Estructura Final

Después de ejecutar el script tendrás:

### Tabla: citas
- ✅ 16 columnas
- ✅ `id_usuario_cliente` (corregido)
- ✅ 3 foreign keys
- ✅ 4 índices

### Tabla: pagos
- ✅ Relacionada con citas
- ✅ Foreign key a `citas(id_cita)`

### Tabla: notificaciones
- ✅ Relacionada con usuarios y citas
- ✅ Foreign keys a `usuarios` y `citas`

---

## 🆘 Si Sigue Fallando

### Error: Cannot create table

**Causa:** Alguna tabla referenciada no existe.

**Solución:**
```sql
-- Verificar que existan estas tablas
SHOW TABLES LIKE 'usuarios';
SHOW TABLES LIKE 'servicios';

-- Si no existen, ejecuta primero el script completo de la BD
SOURCE /ruta/a/skincodeia.sql;
```

### Error: Duplicate key name

**Causa:** Los índices ya existen.

**Solución:**
```sql
-- Eliminar índices antes de crearlos
DROP INDEX idx_citas_cliente ON citas;
DROP INDEX idx_citas_tatuador ON citas;
DROP INDEX idx_citas_estado ON citas;
DROP INDEX idx_citas_fecha_inicio ON citas;
```

---

## ✅ Checklist

Después de ejecutar el script:

- [ ] Tabla `citas` recreada con `id_usuario_cliente`
- [ ] Tabla `pagos` recreada
- [ ] Tabla `notificaciones` recreada
- [ ] Foreign keys configuradas correctamente
- [ ] Índices creados
- [ ] Servidor Node.js reiniciado sin errores
- [ ] No hay errores de "Unknown column"

---

## 📁 Archivos Disponibles

1. **`corregir_citas_con_dependencias.sql`** ⭐ USAR ESTE
   - Maneja automáticamente todas las dependencias
   - Recrea todas las tablas necesarias

2. **`identificar_dependencias_citas.sql`**
   - Para ver qué tablas dependen de citas
   - Útil para diagnóstico

3. **`SOLUCION_ERROR_FOREIGN_KEY.md`**
   - Este documento con todas las soluciones

---

## 🎯 Resumen

**El problema:** No puedes eliminar `citas` porque `pagos` y `notificaciones` dependen de ella.

**La solución:** Usar `SET FOREIGN_KEY_CHECKS = 0` para deshabilitar temporalmente las verificaciones y eliminar/recrear todas las tablas en orden.

**El script:** `corregir_citas_con_dependencias.sql` hace todo esto automáticamente.

---

**Fecha:** Octubre 15, 2025  
**Estado:** Listo para ejecutar  
**Archivo recomendado:** `corregir_citas_con_dependencias.sql`
