-- ============================================
-- CREAR TABLAS Y COLUMNAS FALTANTES
-- ============================================

USE skincodeia1;

-- Crear tabla tatuajes_cliente que falta
CREATE TABLE IF NOT EXISTS tatuajes_cliente (
  id_tatuaje INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario_cliente INT NOT NULL,
  ubicacion_cuerpo VARCHAR(100) NULL,
  descripcion TEXT NULL,
  fecha_realizacion DATE NULL,
  nombre_tatuador VARCHAR(100) NULL,
  url_imagen VARCHAR(300) NULL,
  categoria VARCHAR(50) NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tatuajes_cliente_usuario FOREIGN KEY (id_usuario_cliente) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Agregar columnas faltantes a tatuadores
ALTER TABLE tatuadores 
ADD COLUMN IF NOT EXISTS bio TEXT NULL 
AFTER especialidades;

ALTER TABLE tatuadores 
ADD COLUMN IF NOT EXISTS nombre_artistico VARCHAR(100) NULL 
AFTER nombre;

ALTER TABLE tatuadores 
ADD COLUMN IF NOT EXISTS nombre_real VARCHAR(100) NULL 
AFTER nombre_artistico;

ALTER TABLE tatuadores 
ADD COLUMN IF NOT EXISTS especialidad VARCHAR(200) NULL 
AFTER nombre_real;

-- Crear índices para tatuajes_cliente
CREATE INDEX IF NOT EXISTS idx_tatuajes_cliente_usuario ON tatuajes_cliente(id_usuario_cliente);
CREATE INDEX IF NOT EXISTS idx_tatuajes_categoria ON tatuajes_cliente(categoria);
CREATE INDEX IF NOT EXISTS idx_tatuajes_fecha ON tatuajes_cliente(fecha_realizacion);

-- Verificar que se crearon correctamente
SELECT 'TABLA tatuajes_cliente CREADA:' as Info;
DESCRIBE tatuajes_cliente;

SELECT 'ESTRUCTURA ACTUALIZADA DE tatuadores:' as Info;
DESCRIBE tatuadores;

-- Verificar todas las tablas
SELECT 'TODAS LAS TABLAS EN LA BASE DE DATOS:' as Info;
SHOW TABLES;

-- Contar registros
SELECT 'CONTEO DE TABLAS:' as Info;
SELECT COUNT(*) as 'Total de tablas' 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'skincodeia1';

-- Insertar algunos datos de ejemplo en tatuajes_cliente
INSERT INTO tatuajes_cliente (
    id_usuario_cliente, 
    ubicacion_cuerpo, 
    descripcion, 
    fecha_realizacion,
    nombre_tatuador, 
    categoria
) VALUES 
(2, 'Brazo derecho', 'Tatuaje de rosa pequeña', '2024-01-15', 'Carlos', 'Floral'),
(2, 'Tobillo izquierdo', 'Símbolo infinito', '2024-03-20', 'Carlos', 'Símbolos');

SELECT 'DATOS DE EJEMPLO INSERTADOS:' as Info;
SELECT * FROM tatuajes_cliente;

SELECT '✅ TABLA tatuajes_cliente CREADA Y CONFIGURADA' as Resultado;
