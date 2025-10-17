-- ============================================
-- IDENTIFICAR DEPENDENCIAS DE LA TABLA CITAS
-- ============================================

USE skincodeia;

-- Ver todas las foreign keys que REFERENCIAN a la tabla citas
SELECT 
    TABLE_NAME as 'Tabla que depende de citas',
    CONSTRAINT_NAME as 'Nombre del Constraint',
    COLUMN_NAME as 'Columna',
    REFERENCED_COLUMN_NAME as 'Referencia a citas'
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'skincodeia' 
  AND REFERENCED_TABLE_NAME = 'citas';

-- Ver todas las tablas en la base de datos
SELECT TABLE_NAME as 'Todas las tablas'
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'skincodeia'
ORDER BY TABLE_NAME;

-- Ver estructura actual de citas
DESCRIBE citas;

-- Contar registros en citas
SELECT COUNT(*) as 'Total de registros en citas' FROM citas;

-- Ver registros en citas (primeros 10)
SELECT * FROM citas LIMIT 10;
