-- ============================================
-- AGREGAR COLUMNA fecha_lectura A NOTIFICACIONES
-- ============================================

USE skincodeia1;

-- Ver estructura actual de la tabla notificaciones
SELECT 'ESTRUCTURA ACTUAL DE NOTIFICACIONES:' as Info;
DESCRIBE notificaciones;

-- Agregar columna fecha_lectura si no existe
ALTER TABLE notificaciones
ADD COLUMN IF NOT EXISTS fecha_lectura DATETIME NULL
AFTER fecha_creacion;

-- Verificar que se agregó correctamente
SELECT 'ESTRUCTURA ACTUALIZADA DE NOTIFICACIONES:' as Info;
DESCRIBE notificaciones;

-- Mostrar las columnas de notificaciones
SELECT 'COLUMNAS EN NOTIFICACIONES:' as Info;
SELECT
    COLUMN_NAME as 'Columna',
    DATA_TYPE as 'Tipo',
    IS_NULLABLE as 'Permite NULL',
    COLUMN_DEFAULT as 'Valor por defecto'
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'skincodeia1'
  AND TABLE_NAME = 'notificaciones'
ORDER BY ORDINAL_POSITION;

SELECT '✅ COLUMNA fecha_lectura AGREGADA A NOTIFICACIONES' as Resultado;
