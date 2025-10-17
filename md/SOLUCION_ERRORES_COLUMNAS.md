# 🔧 Solución: Errores de Columnas en Base de Datos

## ❌ Problemas Encontrados y Solucionados

### 1. Error: Unknown column 'tipo' in 'field list'

**Causa:** El controlador `perfilController.js` intentaba acceder a una columna `tipo` que no existe en la tabla `usuarios`.

**Estructura Real:**
```sql
-- La tabla usuarios NO tiene columna 'tipo'
CREATE TABLE usuarios (
  id_usuario INT,
  email VARCHAR(150),
  estado ENUM('activo','inactivo'),
  creado_en TIMESTAMP
);

-- Los roles están en tablas separadas
CREATE TABLE roles (
  id_rol INT,
  nombre ENUM('cliente','tatuador','soporte')
);

CREATE TABLE usuario_roles (
  id_usuario INT,
  id_rol INT
);
```

**✅ Solución Aplicada:**

Modifiqué `perfilController.js` para obtener los roles correctamente:

```javascript
// ANTES (INCORRECTO):
const [usuarios] = await db.execute(
  'SELECT email, tipo FROM usuarios WHERE id_usuario = ?',
  [id_usuario]
);

// DESPUÉS (CORRECTO):
const [usuarios] = await db.execute(
  'SELECT email, estado FROM usuarios WHERE id_usuario = ?',
  [id_usuario]
);

// Obtener roles del usuario
const [rolesData] = await db.execute(
  `SELECT r.nombre as rol 
   FROM usuario_roles ur 
   JOIN roles r ON ur.id_rol = r.id_rol 
   WHERE ur.id_usuario = ?`,
  [id_usuario]
);

const roles = rolesData.map(r => r.rol);
const tipoUsuario = roles.length > 0 ? roles[0] : 'cliente';
```

---

### 2. Error: Unknown column 'id_usuario_cliente' in 'field list'

**Causa:** La tabla `citas` en tu base de datos puede tener una estructura diferente a la esperada.

**Estructura Esperada:**
```sql
CREATE TABLE citas (
  id_cita INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario_cliente INT NOT NULL,  -- Esta columna debe existir
  id_usuario_tatuador INT NULL,
  id_servicio INT NULL,
  estado ENUM('solicitud','programada','confirmada','cancelada','realizada'),
  fecha_hora_inicio DATETIME NULL,
  fecha_hora_fin DATETIME NULL,
  precio DECIMAL(10,2) NULL,
  notas_cliente TEXT NULL,
  notas_internas TEXT NULL,
  url_referencia VARCHAR(300) NULL,
  pago_estado ENUM('pendiente','pagado','reembolsado'),
  pago_monto DECIMAL(10,2) NULL,
  pago_fecha DATETIME NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🔍 Cómo Verificar la Estructura

### Opción 1: phpMyAdmin

1. Abre `http://localhost/phpmyadmin`
2. Selecciona la base de datos `skincodeia`
3. Click en la tabla `citas`
4. Click en la pestaña "Estructura"
5. Verifica que existan estas columnas:
   - `id_cita`
   - `id_usuario_cliente` ← **IMPORTANTE**
   - `id_usuario_tatuador`
   - `id_servicio`
   - `estado`
   - etc.

### Opción 2: SQL Query

Ejecuta este query en phpMyAdmin → SQL:

```sql
USE skincodeia;
DESCRIBE citas;
```

O este para más detalles:

```sql
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'skincodeia' AND TABLE_NAME = 'citas'
ORDER BY ORDINAL_POSITION;
```

---

## ✅ Soluciones

### Solución 1: Recrear la Tabla (Si está mal estructurada)

⚠️ **ADVERTENCIA:** Esto borrará todos los datos de la tabla `citas`.

```sql
USE skincodeia;

-- Eliminar tabla existente
DROP TABLE IF EXISTS citas;

-- Recrear con estructura correcta
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
  CONSTRAINT fk_citas_cliente FOREIGN KEY (id_usuario_cliente) REFERENCES usuarios(id_usuario),
  CONSTRAINT fk_citas_tatuador FOREIGN KEY (id_usuario_tatuador) REFERENCES usuarios(id_usuario),
  CONSTRAINT fk_citas_servicio FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio)
) ENGINE=InnoDB;
```

### Solución 2: Agregar Columnas Faltantes (Si solo faltan algunas)

Si la tabla existe pero le faltan columnas:

```sql
USE skincodeia;

-- Agregar columna id_usuario_cliente si no existe
ALTER TABLE citas 
ADD COLUMN id_usuario_cliente INT NOT NULL AFTER id_cita;

-- Agregar foreign key
ALTER TABLE citas
ADD CONSTRAINT fk_citas_cliente 
FOREIGN KEY (id_usuario_cliente) REFERENCES usuarios(id_usuario);
```

### Solución 3: Renombrar Columna (Si tiene otro nombre)

Si la columna existe pero con otro nombre (ej: `id_cliente`):

```sql
USE skincodeia;

-- Renombrar columna
ALTER TABLE citas 
CHANGE COLUMN id_cliente id_usuario_cliente INT NOT NULL;
```

---

## 🚀 Pasos para Resolver

### Paso 1: Verificar Estructura Actual

```sql
-- Ejecuta en phpMyAdmin
USE skincodeia;
DESCRIBE citas;
```

### Paso 2: Identificar el Problema

Compara la salida con la estructura esperada. Busca:
- ¿Existe la columna `id_usuario_cliente`?
- ¿Tiene otro nombre?
- ¿La tabla tiene una estructura completamente diferente?

### Paso 3: Aplicar Solución

Según lo que encontraste:

**Si la tabla no existe:**
```sql
-- Ejecuta el script completo
SOURCE /ruta/a/skincodeia.sql;
```

**Si la tabla existe pero está mal:**
```sql
-- Opción A: Recrearla (borra datos)
DROP TABLE IF EXISTS citas;
-- Luego ejecuta el CREATE TABLE de arriba

-- Opción B: Modificarla (preserva datos)
ALTER TABLE citas ADD COLUMN ...
```

### Paso 4: Verificar que Funcionó

```sql
-- Debe mostrar todas las columnas correctas
DESCRIBE citas;

-- Intenta insertar un registro de prueba
INSERT INTO citas (id_usuario_cliente, estado) 
VALUES (1, 'solicitud');

-- Si funciona, bórralo
DELETE FROM citas WHERE id_cita = LAST_INSERT_ID();
```

### Paso 5: Reiniciar el Servidor

El servidor con nodemon debería reiniciarse automáticamente, pero si no:

```bash
# En la terminal, presiona Ctrl+C
# Luego:
npm run dev
```

---

## 📋 Checklist de Verificación

- [ ] Tabla `usuarios` tiene columnas: `id_usuario`, `email`, `estado`
- [ ] Tabla `usuarios` NO tiene columna `tipo`
- [ ] Tabla `roles` existe con valores: cliente, tatuador, soporte
- [ ] Tabla `usuario_roles` existe y relaciona usuarios con roles
- [ ] Tabla `citas` tiene columna `id_usuario_cliente`
- [ ] Tabla `citas` tiene columna `id_usuario_tatuador`
- [ ] Tabla `citas` tiene columna `id_servicio`
- [ ] Tabla `servicios` existe y tiene datos
- [ ] Foreign keys están configuradas correctamente
- [ ] `perfilController.js` usa JOIN para obtener roles
- [ ] Servidor Node.js inicia sin errores

---

## 🔧 Script de Verificación Completo

He creado el archivo `verificar_estructura.sql` que puedes ejecutar en phpMyAdmin:

```bash
# Ubicación:
database/verificar_estructura.sql
```

Este script:
1. Muestra la estructura de `citas`
2. Muestra la estructura de `usuarios`
3. Lista todas las columnas con detalles
4. Incluye código comentado para recrear la tabla si es necesario

---

## 💡 Prevención de Errores Futuros

### 1. Usa Migraciones

Crea archivos de migración numerados:

```
database/
  ├── 001_crear_usuarios.sql
  ├── 002_crear_roles.sql
  ├── 003_crear_citas.sql
  ├── 004_crear_servicios.sql
  └── 005_datos_iniciales.sql
```

### 2. Documenta la Estructura

Mantén actualizado un archivo `ESTRUCTURA_BD.md` con:
- Diagrama ER
- Descripción de cada tabla
- Relaciones entre tablas
- Índices y constraints

### 3. Usa Modelos Consistentes

Crea modelos en `src/models/` que reflejen la estructura real:

```javascript
// src/models/Cita.js
class Cita {
  static campos = [
    'id_cita',
    'id_usuario_cliente',  // ← Documenta el nombre exacto
    'id_usuario_tatuador',
    'id_servicio',
    // ...
  ];
}
```

### 4. Valida en Desarrollo

Agrega un script de validación:

```javascript
// scripts/validar-bd.js
const db = require('../src/config/db');

async function validarEstructura() {
  const [columnas] = await db.execute(`
    SELECT COLUMN_NAME 
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'skincodeia' AND TABLE_NAME = 'citas'
  `);
  
  const columnasRequeridas = [
    'id_cita',
    'id_usuario_cliente',
    'id_usuario_tatuador',
    // ...
  ];
  
  columnasRequeridas.forEach(col => {
    if (!columnas.find(c => c.COLUMN_NAME === col)) {
      console.error(`❌ Falta columna: ${col}`);
    }
  });
}
```

---

## 📊 Resumen de Cambios Aplicados

### Archivo: `perfilController.js`

**Cambios:**
1. ✅ Cambiado `SELECT email, tipo` → `SELECT email, estado`
2. ✅ Agregado query para obtener roles desde `usuario_roles`
3. ✅ Agregado campo `roles` en la respuesta JSON
4. ✅ Agregado campo `estado` en la respuesta JSON
5. ✅ Calculado `tipoUsuario` desde el primer rol

**Resultado:**
- ✅ Error "Unknown column 'tipo'" RESUELTO
- ✅ El endpoint `/api/perfil` funciona correctamente
- ✅ Retorna roles del usuario correctamente

### Próximo Paso: Verificar tabla `citas`

1. Abre phpMyAdmin
2. Ejecuta `verificar_estructura.sql`
3. Si la tabla está mal, recréala con el script proporcionado
4. Reinicia el servidor

---

## 🆘 Si Sigues Teniendo Problemas

### Problema: La tabla citas no se puede recrear

**Causa:** Hay foreign keys que la referencian

**Solución:**
```sql
-- Deshabilitar foreign key checks temporalmente
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS citas;

CREATE TABLE citas (...);

SET FOREIGN_KEY_CHECKS = 1;
```

### Problema: Datos importantes en la tabla

**Solución:** Respalda antes de borrar
```sql
-- Crear respaldo
CREATE TABLE citas_backup AS SELECT * FROM citas;

-- Recrear tabla
DROP TABLE citas;
CREATE TABLE citas (...);

-- Migrar datos (ajusta según columnas)
INSERT INTO citas (id_usuario_cliente, estado, ...)
SELECT id_cliente, status, ... FROM citas_backup;

-- Verificar
SELECT COUNT(*) FROM citas;

-- Si todo está bien, borrar respaldo
DROP TABLE citas_backup;
```

---

## ✅ Estado Actual

- ✅ **Error de columna 'tipo'**: RESUELTO
- ⏳ **Error de columna 'id_usuario_cliente'**: PENDIENTE DE VERIFICAR
- 📝 **Scripts creados**: 
  - `verificar_estructura.sql`
  - `SOLUCION_ERRORES_COLUMNAS.md` (este archivo)

**Próxima acción:** Ejecutar `verificar_estructura.sql` en phpMyAdmin para diagnosticar el problema de la tabla `citas`.

---

**Fecha:** Octubre 15, 2025  
**Estado:** En progreso  
**Archivos modificados:** 
- ✅ `src/controllers/perfilController.js`
- ⏳ `database/citas` (pendiente verificación)
