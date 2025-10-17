-- Script para verificar y corregir la estructura de la tabla tatuadores
-- Ejecutar en phpMyAdmin o MySQL Workbench

USE skincodeia;

-- 1. Ver la estructura actual de la tabla
DESCRIBE tatuadores;

-- 2. Si el campo 'bio' NO existe, ejecuta esto:
-- (Descomenta las siguientes líneas si necesitas agregar el campo)

/*
ALTER TABLE tatuadores 
ADD COLUMN bio TEXT NULL 
AFTER especialidad;
*/

-- 3. Si el campo 'creado_en' NO existe, ejecuta esto:
-- (Descomenta las siguientes líneas si necesitas agregar el campo)

/*
ALTER TABLE tatuadores 
ADD COLUMN creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
AFTER activo;
*/

-- 4. Verificar la estructura final
DESCRIBE tatuadores;

-- 5. Ver los datos actuales
SELECT * FROM tatuadores;
