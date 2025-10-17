-- ============================================
-- AGREGAR COLUMNA FALTANTE: url_referencia
-- ============================================

USE skincodeia1;

-- Verificar estructura actual de citas
DESCRIBE citas;

-- Agregar la columna url_referencia si no existe
ALTER TABLE citas 
ADD COLUMN IF NOT EXISTS url_referencia VARCHAR(300) NULL 
AFTER notas_internas;

-- Verificar que se agregó correctamente
DESCRIBE citas;

-- Mostrar las columnas de citas
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'skincodeia1' 
  AND TABLE_NAME = 'citas'
ORDER BY ORDINAL_POSITION;

SELECT '✅ COLUMNA url_referencia AGREGADA' as Resultado;
