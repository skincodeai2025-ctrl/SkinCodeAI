-- ============================================
-- CORREGIR TABLA NOTIFICACIONES
-- ============================================

USE skincodeia1;

-- Ver estructura actual de notificaciones
SELECT 'ESTRUCTURA ACTUAL DE NOTIFICACIONES:' as Info;
DESCRIBE notificaciones;

-- Agregar columna fecha_creacion si no existe
ALTER TABLE notificaciones 
ADD COLUMN IF NOT EXISTS fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
AFTER leida;

-- Verificar estructura actualizada
SELECT 'ESTRUCTURA ACTUALIZADA DE NOTIFICACIONES:' as Info;
DESCRIBE notificaciones;

-- Mostrar todas las columnas disponibles
SELECT 'COLUMNAS DISPONIBLES EN NOTIFICACIONES:' as Info;
SELECT 
    COLUMN_NAME as 'Columna',
    DATA_TYPE as 'Tipo',
    IS_NULLABLE as 'Permite NULL',
    COLUMN_DEFAULT as 'Valor por defecto'
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'skincodeia1' 
  AND TABLE_NAME = 'notificaciones'
ORDER BY ORDINAL_POSITION;

SELECT '✅ COLUMNA fecha_creacion AGREGADA A NOTIFICACIONES' as Resultado;
