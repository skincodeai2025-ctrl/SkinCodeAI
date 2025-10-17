-- ============================================
-- AGREGAR TODAS LAS COLUMNAS FALTANTES A TATUADORES
-- ============================================

USE skincodeia1;

-- Ver estructura actual de tatuadores
SELECT 'ESTRUCTURA ACTUAL DE TATUADORES:' as Info;
DESCRIBE tatuadores;

-- Agregar columna telefono si no existe
ALTER TABLE tatuadores 
ADD COLUMN IF NOT EXISTS telefono VARCHAR(20) NULL 
AFTER portfolio_url;

-- Agregar otras columnas que pueden faltar
ALTER TABLE tatuadores 
ADD COLUMN IF NOT EXISTS nombre_artistico VARCHAR(100) NULL 
AFTER nombre;

ALTER TABLE tatuadores 
ADD COLUMN IF NOT EXISTS nombre_real VARCHAR(100) NULL 
AFTER nombre_artistico;

ALTER TABLE tatuadores 
ADD COLUMN IF NOT EXISTS especialidad VARCHAR(200) NULL 
AFTER nombre_real;

ALTER TABLE tatuadores 
ADD COLUMN IF NOT EXISTS bio TEXT NULL 
AFTER especialidad;

-- Verificar estructura actualizada
SELECT 'ESTRUCTURA ACTUALIZADA DE TATUADORES:' as Info;
DESCRIBE tatuadores;

-- Mostrar todas las columnas disponibles
SELECT 'COLUMNAS DISPONIBLES EN TATUADORES:' as Info;
SELECT 
    COLUMN_NAME as 'Columna',
    DATA_TYPE as 'Tipo',
    IS_NULLABLE as 'Permite NULL',
    COLUMN_DEFAULT as 'Valor por defecto'
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'skincodeia1' 
  AND TABLE_NAME = 'tatuadores'
ORDER BY ORDINAL_POSITION;

SELECT '✅ COLUMNAS AGREGADAS A TATUADORES' as Resultado;
