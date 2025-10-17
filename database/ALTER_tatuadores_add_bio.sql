-- Agregar campo bio a la tabla tatuadores
-- Ejecutar este script en tu base de datos MySQL

USE skincodeia;

-- Verificar si el campo bio ya existe
-- Si no existe, lo agregamos
ALTER TABLE tatuadores 
ADD COLUMN IF NOT EXISTS bio TEXT NULL 
AFTER especialidad;

-- Verificar la estructura actualizada
DESCRIBE tatuadores;
