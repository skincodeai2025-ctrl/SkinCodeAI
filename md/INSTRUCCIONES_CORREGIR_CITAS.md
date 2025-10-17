# 🔧 Instrucciones: Corregir Tabla Citas

## 📋 Situación

La tabla `citas` necesita tener la siguiente estructura para que el sistema funcione correctamente:

```sql
CREATE TABLE citas (
  id_cita INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario_cliente INT NOT NULL,        ← REQUERIDO
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

## 🚀 Solución Rápida (Sin datos importantes)

Si **NO tienes datos importantes** en la tabla `citas`, usa este método:

### Paso 1: Abre phpMyAdmin
```
http://localhost/phpmyadmin
```

### Paso 2: Selecciona la base de datos
- Click en `skincodeia` en el panel izquierdo

### Paso 3: Ejecuta el script
- Click en la pestaña **SQL**
- Click en **Importar archivos**
- Selecciona: `database/corregir_tabla_citas.sql`
- Click en **Continuar**

### Paso 4: Verifica
Deberías ver:
```
✅ TABLA CITAS CREADA CORRECTAMENTE
```

---

## 💾 Solución con Respaldo (Preserva datos)

Si **SÍ tienes datos importantes**, usa este método:

### Paso 1: Abre phpMyAdmin
```
http://localhost/phpmyadmin
```

### Paso 2: Selecciona la base de datos
- Click en `skincodeia`

### Paso 3: Importa el script de migración
- Click en **SQL**
- Click en **Importar archivos**
- Selecciona: `database/migrar_tabla_citas.sql`
- Click en **Continuar**

### Paso 4: Ajusta la migración de datos
El script crea un respaldo automáticamente, pero necesitas ajustar la sección de INSERT según tus columnas anteriores.

Abre `migrar_tabla_citas.sql` y descomenta/ajusta esta sección:

```sql
INSERT INTO citas (
    id_usuario_cliente,
    id_usuario_tatuador,
    -- ...
)
SELECT 
    id_cliente,              -- ← Cambia según tu columna anterior
    id_tatuador,            -- ← Cambia según tu columna anterior
    -- ...
FROM citas_backup;
```

### Paso 5: Verifica los datos
```sql
-- Ver datos originales
SELECT * FROM citas_backup;

-- Ver datos migrados
SELECT * FROM citas;

-- Comparar cantidades
SELECT 
    (SELECT COUNT(*) FROM citas_backup) as Originales,
    (SELECT COUNT(*) FROM citas) as Migrados;
```

### Paso 6: Elimina el respaldo (cuando estés seguro)
```sql
DROP TABLE citas_backup;
```

---

## 📝 Método Manual (Copiar y Pegar)

Si prefieres copiar y pegar el código:

### 1. Abre phpMyAdmin → skincodeia → SQL

### 2. Copia y pega este código:

```sql
USE skincodeia;

-- Deshabilitar foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Eliminar tabla actual
DROP TABLE IF EXISTS citas;

-- Crear tabla correcta
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear índices
CREATE INDEX idx_citas_cliente ON citas(id_usuario_cliente);
CREATE INDEX idx_citas_tatuador ON citas(id_usuario_tatuador);
CREATE INDEX idx_citas_estado ON citas(estado);
CREATE INDEX idx_citas_fecha_inicio ON citas(fecha_hora_inicio);

-- Rehabilitar foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Verificar
DESCRIBE citas;
```

### 3. Click en **Continuar**

### 4. Verifica que aparezcan todas las columnas

---

## ✅ Verificación

Después de ejecutar cualquiera de los scripts, verifica:

### 1. Estructura de la tabla

```sql
DESCRIBE citas;
```

Debe mostrar:
```
+---------------------+------------------+------+-----+
| Field               | Type             | Null | Key |
+---------------------+------------------+------+-----+
| id_cita             | int(11)          | NO   | PRI |
| id_usuario_cliente  | int(11)          | NO   | MUL |
| id_usuario_tatuador | int(11)          | YES  | MUL |
| id_servicio         | int(11)          | YES  | MUL |
| estado              | enum(...)        | NO   |     |
| fecha_hora_inicio   | datetime         | YES  | MUL |
| fecha_hora_fin      | datetime         | YES  |     |
| precio              | decimal(10,2)    | YES  |     |
| notas_cliente       | text             | YES  |     |
| notas_internas      | text             | YES  |     |
| url_referencia      | varchar(300)     | YES  |     |
| pago_estado         | enum(...)        | YES  |     |
| pago_monto          | decimal(10,2)    | YES  |     |
| pago_fecha          | datetime         | YES  |     |
| creado_en           | timestamp        | NO   |     |
| actualizado_en      | timestamp        | YES  |     |
+---------------------+------------------+------+-----+
```

### 2. Columnas críticas

```sql
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'skincodeia' 
  AND TABLE_NAME = 'citas'
  AND COLUMN_NAME IN ('id_usuario_cliente', 'id_usuario_tatuador', 'id_servicio');
```

Debe retornar las 3 columnas.

### 3. Foreign Keys

```sql
SELECT 
    CONSTRAINT_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'skincodeia' 
  AND TABLE_NAME = 'citas'
  AND REFERENCED_TABLE_NAME IS NOT NULL;
```

Debe mostrar:
- `fk_citas_cliente` → `usuarios`
- `fk_citas_tatuador` → `usuarios`
- `fk_citas_servicio` → `servicios`

---

## 🔄 Reiniciar el Servidor

Después de corregir la tabla, el servidor Node.js debería reiniciarse automáticamente con nodemon.

Si no se reinicia:

```bash
# En la terminal, presiona Ctrl+C
# Luego:
npm run dev
```

Deberías ver:
```
Servidor corriendo en http://localhost:3000
```

**Sin errores de columnas.**

---

## 🧪 Probar el Sistema

### 1. Crear una solicitud de cita

```bash
# Usando curl o Postman
POST http://localhost:3000/api/citas/solicitud

Headers:
Authorization: Bearer TU_TOKEN

Body:
{
  "id_servicio": 1,
  "notas_cliente": "Quiero un tatuaje pequeño en el brazo",
  "url_referencia": "https://ejemplo.com/imagen.jpg"
}
```

### 2. Obtener mis citas

```bash
GET http://localhost:3000/api/citas/mis-citas

Headers:
Authorization: Bearer TU_TOKEN
```

### 3. Verificar en la base de datos

```sql
SELECT * FROM citas;
```

---

## 📊 Estructura Completa de Campos

| Campo | Tipo | Nulo | Descripción |
|-------|------|------|-------------|
| `id_cita` | INT | NO | ID único de la cita |
| `id_usuario_cliente` | INT | NO | ID del cliente (FK a usuarios) |
| `id_usuario_tatuador` | INT | YES | ID del tatuador (FK a usuarios) |
| `id_servicio` | INT | YES | ID del servicio (FK a servicios) |
| `estado` | ENUM | NO | Estado: solicitud, programada, confirmada, cancelada, realizada |
| `fecha_hora_inicio` | DATETIME | YES | Fecha y hora de inicio |
| `fecha_hora_fin` | DATETIME | YES | Fecha y hora de fin |
| `precio` | DECIMAL(10,2) | YES | Precio acordado |
| `notas_cliente` | TEXT | YES | Notas/descripción del cliente |
| `notas_internas` | TEXT | YES | Notas privadas del estudio |
| `url_referencia` | VARCHAR(300) | YES | URL de imagen de referencia |
| `pago_estado` | ENUM | YES | Estado del pago: pendiente, pagado, reembolsado |
| `pago_monto` | DECIMAL(10,2) | YES | Monto pagado |
| `pago_fecha` | DATETIME | YES | Fecha del pago |
| `creado_en` | TIMESTAMP | NO | Fecha de creación |
| `actualizado_en` | TIMESTAMP | YES | Última actualización |

---

## 🎯 Relaciones (Foreign Keys)

```
citas.id_usuario_cliente → usuarios.id_usuario (ON DELETE CASCADE)
citas.id_usuario_tatuador → usuarios.id_usuario (ON DELETE SET NULL)
citas.id_servicio → servicios.id_servicio (ON DELETE SET NULL)
```

**Significado:**
- Si se elimina un cliente, se eliminan sus citas
- Si se elimina un tatuador, sus citas quedan sin tatuador asignado
- Si se elimina un servicio, las citas quedan sin servicio asignado

---

## 📁 Archivos Creados

1. **`corregir_tabla_citas.sql`** - Script rápido (borra datos)
2. **`migrar_tabla_citas.sql`** - Script con respaldo (preserva datos)
3. **`INSTRUCCIONES_CORREGIR_CITAS.md`** - Este archivo

---

## 🆘 Solución de Problemas

### Error: Cannot add foreign key constraint

**Causa:** Las tablas referenciadas no existen o tienen estructura incorrecta.

**Solución:**
```sql
-- Verificar que existan las tablas
SHOW TABLES LIKE 'usuarios';
SHOW TABLES LIKE 'servicios';

-- Verificar estructura de usuarios
DESCRIBE usuarios;

-- Debe tener: id_usuario INT PRIMARY KEY
```

### Error: Cannot delete or update a parent row

**Causa:** Hay registros en otras tablas que referencian a `citas`.

**Solución:**
```sql
-- Deshabilitar checks temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Ejecutar el script

-- Rehabilitar checks
SET FOREIGN_KEY_CHECKS = 1;
```

### Error: Table 'citas' already exists

**Causa:** El DROP TABLE no funcionó.

**Solución:**
```sql
-- Forzar eliminación
DROP TABLE IF EXISTS citas;

-- Si no funciona, eliminar foreign keys primero
ALTER TABLE citas DROP FOREIGN KEY fk_citas_cliente;
ALTER TABLE citas DROP FOREIGN KEY fk_citas_tatuador;
ALTER TABLE citas DROP FOREIGN KEY fk_citas_servicio;

-- Luego eliminar tabla
DROP TABLE citas;
```

---

## ✅ Checklist Final

Después de ejecutar el script, verifica:

- [ ] Tabla `citas` existe
- [ ] Columna `id_usuario_cliente` existe
- [ ] Columna `id_usuario_tatuador` existe
- [ ] Columna `id_servicio` existe
- [ ] Foreign keys configuradas correctamente
- [ ] Índices creados
- [ ] Servidor Node.js reiniciado sin errores
- [ ] Puedes crear una cita de prueba
- [ ] Puedes consultar citas sin errores

---

## 🎉 ¡Listo!

Una vez completados todos los pasos, tu sistema debería funcionar correctamente.

**Próximos pasos:**
1. Probar crear solicitudes de citas
2. Probar programar citas
3. Probar consultar citas
4. Cargar servicios de ejemplo

---

**Fecha:** Octubre 15, 2025  
**Estado:** Listo para ejecutar  
**Recomendación:** Usa `corregir_tabla_citas.sql` si no tienes datos importantes
